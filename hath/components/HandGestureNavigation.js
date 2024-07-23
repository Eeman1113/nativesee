// File: components/HandGestureNavigation.js
'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import { drawHand } from '../utils/handUtils';

const HandGestureNavigation = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [page, setPage] = useState('center');

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log('Handpose model loaded.');
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      
      if (hand.length > 0) {
        const thumbTip = hand[0].annotations.thumb[3];
        const indexTip = hand[0].annotations.indexFinger[3];
        const middleTip = hand[0].annotations.middleFinger[3];

        const thumbIndexDistance = Math.sqrt(
          Math.pow(thumbTip[0] - indexTip[0], 2) +
          Math.pow(thumbTip[1] - indexTip[1], 2)
        );
        const thumbMiddleDistance = Math.sqrt(
          Math.pow(thumbTip[0] - middleTip[0], 2) +
          Math.pow(thumbTip[1] - middleTip[1], 2)
        );

        if (thumbIndexDistance < 30) {
          setPage('left');
        } else if (thumbMiddleDistance < 30) {
          setPage('right');
        } else {
          setPage('center');
        }
      }

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight);
      // Remove this line to stop drawing the video feed
      // ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, videoWidth, videoHeight);
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[640px] h-[480px]">
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
            visibility: 'hidden'
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-20 w-full h-full"
        />
      </div>
      <div className="w-full text-center bg-black bg-opacity-50 text-white p-2 mt-2">
        <h2 className="text-2xl font-bold">
          {page === 'left' ? 'Left Page' : 
           page === 'right' ? 'Right Page' : 
           'Current Page: Center'}
        </h2>
      </div>
    </div>
  );
};

export default HandGestureNavigation;
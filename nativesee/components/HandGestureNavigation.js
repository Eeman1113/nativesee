// File: components/HandGestureNavigation.js
'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import { drawHand } from '../utils/handUtils';
import PreviousMap from 'postcss/lib/previous-map';

const HandGestureNavigation = ({ nextPage, prevPage }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [direction, setDirection] = useState('center');
  const [lastChanged, setLastChanged] = useState(0)

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log('Handpose model loaded.');
    setInterval(() => {
      detect(net);
    }, 100);
  };

  useEffect(() => {
    if (direction === 'center') return;
    const timeElapsed = Date.now() - lastChanged;
    if (timeElapsed < 1000) {
      return;
    }
    if (direction === 'left') {
      prevPage();
    } else if (direction === 'right') {
      nextPage();
    }
    console.log('navigation:', direction);
    setLastChanged(Date.now());
  }, [direction]);

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
          setDirection('left');
        } else if (thumbMiddleDistance < 30) {
          setDirection('right');
        } else {
          setDirection('center');
        }
      }

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight);
      // Remove this line to stop drawing the video feed
      // ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, videoWidth, videoHeight);
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="fixed top-0 left-0 z-20 w-[1px] h-[1px]">
        <Webcam
          ref={webcamRef}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 20,
            width: 100,
            height: 100,
            visibility: 'hidden',
          }}
        />
        <canvas
          ref={canvasRef}
          className="fixed top-1/2 left-20 z-20 w-[500px] h-[500px]"
        />
      </div>
      {/* <div className="w-full text-center bg-black bg-opacity-50 text-white p-2 mt-2">
        <h2 className="text-2xl font-bold">
          {page === 'left' ? 'Left Page' :
            page === 'right' ? 'Right Page' :
              'Current Page: Center'}
        </h2>
      </div> */}
    </div>
  );
};

export default HandGestureNavigation;
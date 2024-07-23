import HandGestureNavigation from '../components/HandGestureNavigation';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-400 glow-text-purple">アンプゼー</h1>
      <HandGestureNavigation />
    </main>
  );
}

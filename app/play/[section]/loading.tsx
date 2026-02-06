export default function PlayLoading() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-ice-100 to-ice-200">
      <div className="animate-bounce mb-4">
        <img
          src="/images/penguin.png"
          alt="Loading penguin"
          width={80}
          height={80}
        />
      </div>
      <p className="text-xl text-arctic-700 font-semibold animate-pulse">
        Getting your problem ready...
      </p>
    </div>
  );
}

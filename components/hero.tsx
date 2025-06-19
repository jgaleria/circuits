export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl md:text-6xl font-bold">
        Welcome to{' '}
        <span className="bg-gradient-to-r from-circuits-dark-blue to-circuits-medium-blue bg-clip-text text-transparent">
          Circuits
        </span>
      </h1>
      <div className="mt-4 text-xl md:text-2xl text-muted-foreground">
        Connect your Fitness Journey
      </div>
    </div>
  );
}

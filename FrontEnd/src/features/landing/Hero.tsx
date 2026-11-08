import heroImage from '../../assets/hero.png'
import logo from '../../assets/logo.png'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" aria-hidden />
      <div className="relative mx-auto flex min-h-[26rem] max-w-7xl items-center justify-between gap-8 px-4 py-16 sm:px-6">
        <h1 className="max-w-3xl animate-rise font-display text-4xl leading-tight sm:text-6xl">
          Compete with other people on the world to be the ultimate{' '}
          <span className="text-brand-text">My Winter Car</span> player!
        </h1>
        <img
          src={logo}
          alt="My Winter Car"
          className="hidden w-52 shrink-0 animate-fade-in drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105 hover:rotate-[-4deg] md:block lg:w-64"
        />
      </div>
    </section>
  )
}

import Assets from '@assets/index';

export default function Home() {
  return (
    <section className="relative box-border flex h-full flex-col items-center pt-[76px] text-center">
      <img className="aspect-square w-[120px]" src={Assets.IconLogo} />
      <dl className="mt-[30px]">
        <dt className="text-[36px] font-bold leading-[45px] text-midnight-blue">
          Welcome to
          <br />
          Milhous
        </dt>
        <dd className="mt-2.5 px-[48px] text-[15px] leading-6 text-dark-gray">
          Manage all your crypto assets! It’s simple and easy!
        </dd>
      </dl>
      <button className="mt-[100px] h-[46px] w-[200px] rounded-[23px] bg-primary-blue text-center text-[20px] font-semibold leading-[46px] text-white">
        Create Account
      </button>
      <span className="mt-4 cursor-pointer text-dark-gray">Forgot your password?</span>
    </section>
  );
}

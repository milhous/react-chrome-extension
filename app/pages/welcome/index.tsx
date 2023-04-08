import Assets from '@assets/index';

import CreateAccount from './components/CreateAccount';

export default function PageWelcome() {
  return (
    <section className="app-page app-page_welcome flex flex-col items-center pt-[50px]">
      <img className="aspect-square w-[120px]" src={Assets.IconLogo} />
      <dl className="mt-[30px] text-center">
        <dt className="text-[36px] font-bold leading-[45px] text-midnight-blue">
          Welcome to
          <br />
          Milhous
        </dt>
        <dd className="mt-2.5 px-[48px] text-[15px] leading-6 text-dark-gray">管理您的所有加密资产！它简单易操作！</dd>
      </dl>
      <CreateAccount />
      {/* <span className="mt-4 cursor-pointer text-dark-gray">忘记密码了？</span> */}
    </section>
  );
}
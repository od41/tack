import GenerateWalletComponent from "./_component/create_account"

const WelcomePage = () => {
  return (
    <>
      <header className="border-b">
        <div className=" flex-col md:flex">
          Tack
        </div>
      </header>

      <GenerateWalletComponent />
    </>
  )
}

export default WelcomePage
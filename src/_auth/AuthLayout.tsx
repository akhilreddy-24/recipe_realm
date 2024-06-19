import { Outlet, Navigate } from 'react-router-dom';
import AnimationComponent from './AnimationComponent'; // Import your AnimationComponent here

const AuthLayout = () => {
  const isAuthenticated = false; // You can change this to your actual authentication check

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <AnimationComponent /> {/* Display the animation */}
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
          <img
            src="/assets/images/side-img.svg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
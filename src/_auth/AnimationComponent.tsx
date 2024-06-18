import React, { useEffect } from 'react';
import { useSpring, animated, config } from "react-spring"
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const WelcomeMessage = styled(animated.div)`
  margin-top: 50px; /* Adjust the margin-top value as needed */
`;

const AnimationComponent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/sign-in');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const fadeInAndSlide = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.slow,
  });

  return (
    <WelcomeMessage style={fadeInAndSlide}>
      <h1>Welcome to Snapgram!</h1>
    </WelcomeMessage>
  );
};

export default AnimationComponent;
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import PasswordRecoveryModal from '../components/PasswordRecoveryModal';

const LoginPage = () => {
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const handleOpenRecoveryModal = () => {
    setShowRecoveryModal(true);
  };

  const handleCloseRecoveryModal = () => {
    setShowRecoveryModal(false);
  };

  return (
    <div className="container">
      <h1>Iniciar Sesión</h1>
      <LoginForm />
      <p>
        <button className="btn btn-link" onClick={handleOpenRecoveryModal}>
          ¿Olvidaste tu contraseña?
        </button>
      </p>

      {showRecoveryModal && <PasswordRecoveryModal onClose={handleCloseRecoveryModal} />}
    </div>
  );
};

export default LoginPage;

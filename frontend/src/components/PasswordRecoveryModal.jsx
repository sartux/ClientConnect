import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';

const PasswordRecoveryModal = ({ onClose }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [username, setUsername] = useState('');

  const initialValues = {
    username: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('El nombre de usuario es obligatorio'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await authService.requestPasswordReset(values.username);
      setUsername(values.username);
      setEmailSent(true);
    } catch (error) {
      setFieldError('username', 'No se pudo enviar el código de recuperación');
    }
    setSubmitting(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Recuperar acceso</h4>
        {!emailSent ? (
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label>Usuario</label>
                  <Field name="username" type="text" className="form-control" />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  Enviar Código
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <p>Se ha enviado un código de recuperación a: {username.slice(0, 2)}****{username.slice(-2)}</p>
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordRecoveryModal;

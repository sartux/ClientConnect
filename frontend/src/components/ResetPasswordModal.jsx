import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';

const ResetPasswordModal = ({ token, onClose }) => {
  const initialValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La nueva contraseña es obligatoria'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
      .required('La confirmación de la nueva contraseña es obligatoria'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await authService.resetPassword(token, values.newPassword);
      alert('Contraseña actualizada con éxito');
      onClose();
    } catch (error) {
      setFieldError('newPassword', 'No se pudo actualizar la contraseña');
    }
    setSubmitting(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Restablecer contraseña</h4>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label>Nueva contraseña</label>
                <Field name="newPassword" type="password" className="form-control" />
                <ErrorMessage name="newPassword" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label>Confirmar nueva contraseña</label>
                <Field name="confirmNewPassword" type="password" className="form-control" />
                <ErrorMessage name="confirmNewPassword" component="div" className="text-danger" />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Restablecer Contraseña
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPasswordModal;

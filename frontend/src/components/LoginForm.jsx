import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';

const LoginForm = () => {
  const initialValues = {
    company: '',
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    company: Yup.string().required('El nombre de la empresa es obligatorio'),
    username: Yup.string().required('El nombre de usuario es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await authService.login(values);
      console.log(response);  // Guardar el token y redirigir al dashboard
    } catch (error) {
      setFieldError('password', 'Credenciales incorrectas o usuario bloqueado');
    }
    setSubmitting(false);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label>Empresa</label>
            <Field name="company" type="text" className="form-control" />
            <ErrorMessage name="company" component="div" className="text-danger" />
          </div>

          <div className="form-group">
            <label>Usuario</label>
            <Field name="username" type="text" className="form-control" />
            <ErrorMessage name="username" component="div" className="text-danger" />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <Field name="password" type="password" className="form-control" />
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Iniciar Sesión
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;

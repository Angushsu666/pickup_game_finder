import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [],
    skillLevel: 'intermediate'
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    interests: Yup.array()
      .min(1, 'Select at least one interest')
      .required('Interests are required'),
    skillLevel: Yup.string()
      .required('Skill level is required')
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = values;
    
    const result = await register(userData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/find-games');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Create an Account</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label>Interests</label>
                <div className="checkbox-group">
                  <label>
                    <Field type="checkbox" name="interests" value="soccer" />
                    Soccer
                  </label>
                  <label>
                    <Field type="checkbox" name="interests" value="basketball" />
                    Basketball
                  </label>
                  <label>
                    <Field type="checkbox" name="interests" value="volleyball" />
                    Volleyball
                  </label>
                </div>
                <ErrorMessage name="interests" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="skillLevel">Skill Level</label>
                <Field as="select" id="skillLevel" name="skillLevel">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Field>
                <ErrorMessage name="skillLevel" component="div" className="error-message" />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 
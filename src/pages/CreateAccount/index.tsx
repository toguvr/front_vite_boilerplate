import React, { useState } from 'react';
import { TextField, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonSharp from '@mui/icons-material/PersonSharp';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PublicLayout from '../../components/PublicLayout';

import { LoginTitle, LoginEmail, LoginPassword, RegisterLink } from './styles';
import { theme } from '../../theme';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

export const CreateAccount = () => {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  async function handleCreateAccount() {
    setErrors({});
    setLoading(true);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .email('Email inválido')
          .required('Email obrigatório'),
        password: Yup.string()
          .min(6, 'Mínimo de 6 caracteres')
          .required('Senha obrigatória'),
      });

      await schema.validate(values, { abortEarly: false });

      await api.post('/users', values);

      toast.success('Cadastrado com sucesso!');
      await signIn({ email: values.email, password: values.password });
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          validationErrors[error.path as string] = error.message;
        });
        setErrors(validationErrors);
        return;
      }
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <LoginTitle>Criar uma conta</LoginTitle>
      <Typography variant="body2" textAlign="center">
        Por favor, insira seus dados para se cadastrar
      </Typography>

      <LoginEmail>Nome</LoginEmail>
      <TextField
        id="name"
        size="small"
        fullWidth
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        value={values.name}
        error={!!errors.name}
        helperText={errors.name}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonSharp
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
            </InputAdornment>
          ),
        }}
      />
      <LoginEmail>Email</LoginEmail>
      <TextField
        id="email"
        type="email"
        size="small"
        fullWidth
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        value={values.email}
        error={!!errors.email}
        helperText={errors.email}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailSharpIcon
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
            </InputAdornment>
          ),
        }}
      />

      <LoginPassword>Senha</LoginPassword>
      <TextField
        id="password"
        size="small"
        fullWidth
        type="password"
        onChange={(e) => setValues({ ...values, password: e.target.value })}
        value={values.password}
        error={!!errors.password}
        helperText={errors.password}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockSharpIcon
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleCreateAccount}
        loading={loading}
      >
        Cadastrar
      </LoadingButton>

      <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
        Já possui uma conta? <RegisterLink href="/">Entrar</RegisterLink>
      </Typography>
    </PublicLayout>
  );
};

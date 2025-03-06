import React, { useState } from 'react';
import { TextField, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ForgotPasswordTitle,
  ForgotPasswordText,
  ForgotPasswordEmail,
  RegisterLink,
} from './styles';
import PublicLayout from '../../components/PublicLayout';
import { theme } from '../../theme';
import api from '../../services/api';
import ReCAPTCHA from 'react-google-recaptcha';

export const ForgotPassword = () => {
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  async function handleForgotPassword() {
    setErrors({});
    setLoading(true);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Email inválido')
          .required('Email obrigatório'),
      });

      await schema.validate({ email }, { abortEarly: false });

      await api.post('/users/forgot', { email });

      toast.success('E-mail de recuperação enviado!');
      navigate('/');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors({ email: err.errors[0] });
        return;
      }
      toast.error(
        err?.response?.data?.message ||
          'Erro ao enviar recuperação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <ForgotPasswordTitle>Esqueceu sua senha?</ForgotPasswordTitle>
      <ForgotPasswordText>
        Por favor, insira seu email para redefinir sua senha.
      </ForgotPasswordText>

      <ForgotPasswordEmail>Email</ForgotPasswordEmail>
      <TextField
        id="email"
        size="small"
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
        value={email}
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
      <ForgotPasswordText style={{ color: 'red' }}>
        Se não encontrar o e-mail na sua caixa de entrada, verifique a pasta de
        spam ou lixo eletrônico.
      </ForgotPasswordText>
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
        onChange={() => setVerified(true)}
      />
      <LoadingButton
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleForgotPassword}
        loading={loading}
        disabled={loading || verified === false}
      >
        Redefinir Senha
      </LoadingButton>

      <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
        Lembrou sua senha? <RegisterLink href="/">Entrar</RegisterLink>
      </Typography>
    </PublicLayout>
  );
};

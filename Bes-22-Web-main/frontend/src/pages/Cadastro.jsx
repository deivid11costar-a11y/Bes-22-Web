import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Check, X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Requisitos de senha LGPD
const passwordRules = [
  { id: 'length',    label: 'Mínimo 8 caracteres',         test: (p) => p.length >= 8 },
  { id: 'upper',     label: 'Uma letra maiúscula (A-Z)',    test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',     label: 'Uma letra minúscula (a-z)',    test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'Um número (0-9)',              test: (p) => /[0-9]/.test(p) },
  { id: 'special',   label: 'Um caractere especial (!@#$)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ nome: '', email: '', password: '', confirmPassword: '', server: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    if (field === 'nome') setNome(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateFields = () => {
    const newErrors = { nome: '', email: '', password: '', confirmPassword: '', server: '' };
    let valid = true;

    // Regra 1 — Nome só letras e espaços
    if (!nome) {
      newErrors.nome = 'O nome é obrigatório.';
      valid = false;
    } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
      newErrors.nome = 'O nome não pode conter números ou caracteres especiais.';
      valid = false;
    } else if (nome.trim().length < 2) {
      newErrors.nome = 'Insira um nome válido.';
      valid = false;
    }

    // Regra 2 — E-mail com domínios válidos
    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'bol.com.br', 'uol.com.br'];
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Insira um e-mail válido.';
      valid = false;
    } else {
      const dominio = email.split('@')[1]?.toLowerCase();
      if (!dominiosValidos.includes(dominio)) {
        newErrors.email = 'Use um e-mail válido (Gmail, Hotmail, Outlook, etc).';
        valid = false;
      }
    }

    // Regra 3 — Senha LGPD
    const allRulesPassed = passwordRules.every(rule => rule.test(password));
    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
      valid = false;
    } else if (!allRulesPassed) {
      newErrors.password = 'A senha não atende todos os requisitos.';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha.';
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErrors({ nome: '', email: '', password: '', confirmPassword: '', server: '' });
    if (!validateFields()) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/register`, { name: nome, email, password });
      setSucesso(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err.response?.data?.error) {
        setErrors(prev => ({ ...prev, server: err.response.data.error }));
      } else {
        setErrors(prev => ({ ...prev, server: 'Erro de conexão com o servidor. Tente novamente.' }));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBorder = (field) => ({
    border: `1px solid ${errors[field] ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
  });

  const labelStyle = {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem',
    letterSpacing: '0.5px', textTransform: 'uppercase',
  };

  const inputStyle = (field, extraPadding = '') => ({
    width: '100%',
    padding: extraPadding || '0.75rem 1rem 0.75rem 2.25rem',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '0.75rem',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
    ...inputBorder(field),
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '1rem',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
      }}>

        {/* Ícone e título */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            borderRadius: '50%',
            width: 60, height: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 20px rgba(108,99,255,0.4)',
          }}>
            <UserPlus size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem', letterSpacing: '-0.5px' }}>
            Criar Conta
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', margin: 0 }}>
            Preencha os dados para se cadastrar
          </p>
        </div>

        {/* Sucesso */}
        {sucesso && (
          <div style={{
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.3)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            color: '#34d399',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginBottom: '1rem',
          }}>
            Cadastro realizado! Redirecionando para o login...
          </div>
        )}

        <form onSubmit={handleCadastro} noValidate>

          {/* Campo Nome */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Nome</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)',
              }} />
              <input
                type="text"
                value={nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Seu nome completo"
                style={inputStyle('nome')}
              />
            </div>
            {errors.nome && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.3rem 0 0 0.25rem' }}>⚠️ {errors.nome}</p>}
          </div>

          {/* Campo E-mail */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)',
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="seu@gmail.com"
                autoComplete="email"
                style={inputStyle('email')}
              />
            </div>
            {errors.email && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.3rem 0 0 0.25rem' }}>⚠️ {errors.email}</p>}
          </div>

          {/* Campo Senha */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                placeholder="••••••••"
                autoComplete="new-password"
                style={inputStyle('password', '0.75rem 2.5rem 0.75rem 2.25rem')}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
                padding: 0, display: 'flex',
              }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Requisitos da senha — aparece ao focar */}
            {(passwordFocused || password) && (
              <div style={{
                marginTop: '0.5rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.6rem',
                padding: '0.6rem 0.75rem',
              }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.4rem', fontWeight: 600 }}>
                  Requisitos da senha:
                </p>
                {passwordRules.map(rule => {
                  const passed = rule.test(password);
                  return (
                    <div key={rule.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      marginBottom: '0.2rem',
                    }}>
                      {passed
                        ? <Check size={13} color="#34d399" />
                        : <X size={13} color="#f87171" />
                      }
                      <span style={{
                        fontSize: '0.78rem',
                        color: passed ? '#34d399' : 'rgba(255,255,255,0.4)',
                        textDecoration: passed ? 'line-through' : 'none',
                        transition: 'all 0.2s',
                      }}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {errors.password && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.3rem 0 0 0.25rem' }}>⚠️ {errors.password}</p>}
          </div>

          {/* Campo Confirmar Senha */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Confirmar Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)',
              }} />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                style={inputStyle('confirmPassword', '0.75rem 2.5rem 0.75rem 2.25rem')}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
                padding: 0, display: 'flex',
              }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.3rem 0 0 0.25rem' }}>⚠️ {errors.confirmPassword}</p>}
          </div>

          {/* Erro do servidor */}
          {errors.server && (
            <div style={{
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: '0.5rem',
              padding: '0.6rem 0.75rem',
              color: '#f87171',
              fontSize: '0.82rem',
              marginBottom: '0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              ⚠️ {errors.server}
            </div>
          )}

          {/* Botão Cadastrar */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              border: 'none',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(108,99,255,0.35)',
              transition: 'opacity 0.2s',
              letterSpacing: '0.3px',
              marginBottom: '1rem',
            }}
          >
            <UserPlus size={18} />
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>

          {/* Link para login */}
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Já tem conta?{' '}
            <span
              onClick={() => navigate('/')}
              style={{ color: 'rgba(167,139,250,0.8)', cursor: 'pointer', fontWeight: 500 }}
            >
              Fazer login
            </span>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Cadastro;
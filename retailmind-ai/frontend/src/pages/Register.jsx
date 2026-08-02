import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { Sparkles, User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'retailer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      const resp = err.response?.data;
      if (resp) {
        const firstKey = Object.keys(resp)[0];
        setError(`${firstKey}: ${resp[firstKey]}`);
      } else {
        setError('Registration failed. Please check input values.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400">Register for RetailMind AI Demand Forecasting</p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="store_manager_01"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="manager@retailstore.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Role Scope</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition appearance-none"
              >
                <option value="retailer">Retailer Store Manager</option>
                <option value="distributor">FMCG Distributor</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            <span>{loading ? 'Creating account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

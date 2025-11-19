"use client";

import { useState, useEffect } from "react";
import { 
  Trophy, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Users,
  CheckCircle2,
  DollarSign,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  ChevronLeft,
  ChevronRight,
  Lock,
  Brain,
  Dumbbell,
  Book,
  Palette,
  PiggyBank,
  Film,
  PartyPopper,
  Star,
  Zap,
  ThumbsUp,
  MessageCircle,
  Award,
  Send,
  UserPlus
} from "lucide-react";

// Tipos para posts e interações
interface Post {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  days_count: number;
  likes: number;
  claps: number;
  awards: number;
  comments: Comment[];
  userLiked?: boolean;
  userClapped?: boolean;
  userAwarded?: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "onboarding" | "home" | "challenge" | "diary" | "finance" | "community">("login");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [mood, setMood] = useState("");
  const [diaryEntry, setDiaryEntry] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedAlternatives, setSelectedAlternatives] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedRelaxation, setSelectedRelaxation] = useState<string[]>([]);
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationDay, setCelebrationDay] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para comunidade
  const [communityTab, setCommunityTab] = useState<"feed" | "share">("feed");
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [showReaction, setShowReaction] = useState<{ type: string; postId: string } | null>(null);

  // Mensagens motivacionais para cada dia
  const celebrationMessages: Record<number, { title: string; message: string; icon: string }> = {
    1: {
      title: "Primeiro Passo Dado! 🎯",
      message: "Você deu o primeiro e mais importante passo! Reconhecer seus gatilhos é o início da transformação. Continue assim!",
      icon: "🎯"
    },
    2: {
      title: "Alternativas Descobertas! 🌟",
      message: "Incrível! Agora você tem opções saudáveis para quando sentir vontade de jogar. Você está construindo uma nova vida!",
      icon: "🌟"
    },
    3: {
      title: "Metas Definidas! 🎪",
      message: "Suas metas estão traçadas! Cada objetivo é um degrau para sua liberdade. Você está no caminho certo!",
      icon: "🎪"
    },
    4: {
      title: "Paz Interior Conquistada! 🧘",
      message: "Você aprendeu a acalmar sua mente! Essas técnicas serão suas aliadas nos momentos difíceis. Parabéns!",
      icon: "🧘"
    },
    5: {
      title: "Emoções Expressadas! 📝",
      message: "Colocar sentimentos no papel liberta a alma! Você está processando suas emoções de forma saudável. Continue!",
      icon: "📝"
    },
    6: {
      title: "Comunidade Encontrada! 🤝",
      message: "Você não está sozinho! Fazer parte de uma comunidade multiplica sua força. Juntos somos mais fortes!",
      icon: "🤝"
    },
    7: {
      title: "Uma Semana Completa! 🎊",
      message: "7 DIAS LIVRE! Você desconectou da tecnologia e reconectou com a vida real. Isso é uma grande vitória!",
      icon: "🎊"
    },
    8: {
      title: "Conhecimento é Poder! 🧠",
      message: "Agora você entende como o vício funciona! Esse conhecimento te torna mais forte contra os impulsos. Excelente!",
      icon: "🧠"
    },
    9: {
      title: "Gratidão Praticada! 🙏",
      message: "Focar no positivo transforma sua mente! Sua lista de gratidão é um tesouro. Continue praticando diariamente!",
      icon: "🙏"
    },
    10: {
      title: "10 Dias de Vitória! 🏆",
      message: "METADE DO CAMINHO! Você criou um sistema de recompensas saudável. Seu cérebro está sendo reprogramado!",
      icon: "🏆"
    },
    11: {
      title: "Corpo em Movimento! 🚶",
      message: "Você movimentou seu corpo e liberou endorfinas naturais! Exercício é remédio para a alma. Sensacional!",
      icon: "🚶"
    },
    12: {
      title: "Inspiração Absorvida! 🎬",
      message: "Histórias de superação fortalecem sua determinação! Você também está escrevendo sua história de vitória!",
      icon: "🎬"
    },
    13: {
      title: "Força Física Ativada! 💪",
      message: "Seu corpo está mais forte e sua mente também! Exercícios regulares são fundamentais na recuperação. Parabéns!",
      icon: "💪"
    },
    14: {
      title: "Duas Semanas Livres! 👨‍🍳",
      message: "14 DIAS! Você criou algo com suas próprias mãos! Cozinhar é terapêutico e produtivo. Continue criando!",
      icon: "👨‍🍳"
    },
    15: {
      title: "Mente Expandida! 📚",
      message: "A leitura abre novos horizontes! Você está investindo em conhecimento e crescimento pessoal. Fantástico!",
      icon: "📚"
    },
    16: {
      title: "Arte Criada! 🎨",
      message: "Você expressou suas emoções através da arte! Criar é curar. Suas boas lembranças estão vivas!",
      icon: "🎨"
    },
    17: {
      title: "Rede de Apoio Mapeada! 👥",
      message: "Você identificou quem te apoia! Nunca hesite em pedir ajuda. Você tem pessoas que te amam!",
      icon: "👥"
    },
    18: {
      title: "Finanças Organizadas! 💰",
      message: "Controle financeiro é liberdade! Você está no comando do seu dinheiro agora. Isso é empoderamento!",
      icon: "💰"
    },
    19: {
      title: "Mente Tranquila! 🧘‍♂️",
      message: "10 minutos de meditação fortalecem seu autocontrole! Você está dominando sua mente. Incrível!",
      icon: "🧘‍♂️"
    },
    20: {
      title: "Futuro Planejado! ✉️",
      message: "Você escreveu para seu eu do futuro! Daqui a 1 ano você vai se orgulhar dessa jornada. Quase lá!",
      icon: "✉️"
    },
    21: {
      title: "🎉 VOCÊ CONSEGUIU! 🎉",
      message: "21 DIAS COMPLETOS! Você reprogramou seu cérebro e quebrou o ciclo do vício! Você é um VENCEDOR! Mas lembre-se: a jornada continua. Continue interagindo com a comunidade e apoiando outros que estão passando pelo mesmo desafio. Sua história pode inspirar e salvar vidas! 🌟💪🏆",
      icon: "🎉"
    }
  };

  // Função para mostrar celebração
  const handleDayCompletion = (day: number) => {
    const newCompletedDays = [...completedDays, day];
    setCompletedDays(newCompletedDays);
    setCelebrationDay(day);
    setShowCelebration(true);
    
    // Esconder celebração após 5 segundos
    setTimeout(() => {
      setShowCelebration(false);
      if (day < 21) {
        setCurrentDay(day + 1);
      }
    }, 5000);
  };

  // Funções de interação na comunidade
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLiked = !post.userLiked;
        return {
          ...post,
          likes: newLiked ? post.likes + 1 : post.likes - 1,
          userLiked: newLiked
        };
      }
      return post;
    }));
    showReactionAnimation("like", postId);
  };

  const handleClap = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newClapped = !post.userClapped;
        return {
          ...post,
          claps: newClapped ? post.claps + 1 : post.claps - 1,
          userClapped: newClapped
        };
      }
      return post;
    }));
    showReactionAnimation("clap", postId);
  };

  const handleAward = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newAwarded = !post.userAwarded;
        return {
          ...post,
          awards: newAwarded ? post.awards + 1 : post.awards - 1,
          userAwarded: newAwarded
        };
      }
      return post;
    }));
    showReactionAnimation("award", postId);
  };

  const handleComment = (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText || !commentText.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now().toString(),
              user: userName || "Você",
              message: commentText,
              timestamp: "Agora"
            }
          ]
        };
      }
      return post;
    }));

    setNewComment({ ...newComment, [postId]: "" });
    showReactionAnimation("comment", postId);
  };

  const showReactionAnimation = (type: string, postId: string) => {
    setShowReaction({ type, postId });
    setTimeout(() => setShowReaction(null), 1000);
  };

  const handleShareProgress = () => {
    if (!newPost.trim()) return;

    const newPostObj: Post = {
      id: Date.now().toString(),
      user_id: userId || "temp",
      user_name: userName || "Guerreiro",
      message: newPost,
      days_count: completedDays.length,
      likes: 0,
      claps: 0,
      awards: 0,
      comments: [],
      created_at: new Date().toISOString()
    };

    setPosts([newPostObj, ...posts]);
    setNewPost("");
    setCommunityTab("feed");
    
    alert("🎉 Seu progresso foi compartilhado com a comunidade!");
  };

  // Salvar diário
  const handleSaveDiary = () => {
    if (!mood || !diaryEntry) return;
    
    alert("Registro salvo! Continue assim, você está indo muito bem! 💚");
    setMood("");
    setDiaryEntry("");
  };

  // Adicionar economia
  const handleAddSavings = () => {
    if (!newAmount || parseFloat(newAmount) <= 0) return;
    
    const newTotal = totalSaved + parseFloat(newAmount);
    setTotalSaved(newTotal);
    setNewAmount("");
  };

  // Componente de Celebração
  const CelebrationModal = () => {
    if (!showCelebration) return null;
    
    const celebration = celebrationMessages[celebrationDay];
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="max-w-md w-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 shadow-2xl border-4 border-white/30 animate-scaleIn">
          <div className="text-center">
            {/* Ícone animado */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-white/20 rounded-full animate-ping"></div>
              </div>
              <div className="relative inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-2xl">
                <span className="text-6xl animate-bounce">{celebration.icon}</span>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-3xl font-bold text-white mb-4 animate-slideDown">
              {celebration.title}
            </h2>

            {/* Mensagem */}
            <p className="text-xl text-white/90 leading-relaxed mb-6 animate-slideUp">
              {celebration.message}
            </p>

            {/* Estrelas decorativas */}
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Badge de progresso */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/40">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-300" />
                <div className="text-left">
                  <p className="text-white/80 text-sm">Dia Concluído</p>
                  <p className="text-2xl font-bold text-white">{celebrationDay} de 21</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-300" />
              </div>
            </div>

            {/* Botão de continuar */}
            <button
              onClick={() => {
                setShowCelebration(false);
                if (celebrationDay < 21) {
                  setCurrentDay(celebrationDay + 1);
                }
              }}
              className="mt-6 w-full py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {celebrationDay === 21 ? "Ver Meu Progresso" : "Continuar Jornada"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Login/Register Screen
  if (currentScreen === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">21 Dias Livre</h1>
            <p className="text-blue-200">Liberte-se do vício em jogos de azar</p>
          </div>

          <div className="space-y-4 mb-6">
            {isRegistering && (
              <input
                type="text"
                placeholder="Nome completo"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            )}
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            onClick={() => {
              if (isRegistering) {
                if (userName.trim() && email.trim() && password.trim()) {
                  setUserId(Date.now().toString());
                  setCurrentScreen("onboarding");
                }
              } else {
                if (email.trim() && password.trim()) {
                  setUserName("Guerreiro");
                  setUserId(Date.now().toString());
                  setCurrentScreen("home");
                }
              }
            }}
            disabled={isRegistering ? (!userName.trim() || !email.trim() || !password.trim()) : (!email.trim() || !password.trim())}
            className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            <Lock className="w-5 h-5" />
            {isRegistering ? "Criar Conta" : "Entrar"}
          </button>

          <div className="text-center mb-6">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-300 hover:text-white transition-colors text-sm"
            >
              {isRegistering ? "Já tem uma conta? Entrar" : "Não tem conta? Cadastre-se"}
            </button>
          </div>

          {/* Botão de Nova Inscrição em destaque */}
          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setIsRegistering(true);
                setUserName("");
                setEmail("");
                setPassword("");
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 mb-4"
            >
              <UserPlus className="w-6 h-6" />
              <span>Nova Inscrição - Comece Agora!</span>
            </button>
            <p className="text-blue-200 text-sm text-center mb-4">Primeira vez aqui? Crie sua conta gratuitamente</p>
          </div>

          {!isRegistering && (
            <div className="pt-4 border-t border-white/10">
              <p className="text-blue-200 text-sm text-center mb-4">Por que se cadastrar?</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-200 text-sm">Acompanhe seu progresso de 21 dias</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-200 text-sm">Controle financeiro e economia</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-200 text-sm">Comunidade de apoio</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Onboarding Screen (after registration)
  if (currentScreen === "onboarding") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo, {userName}!</h1>
            <p className="text-blue-200">Você está prestes a mudar sua vida</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold">Desafio de 21 Dias</h3>
                <p className="text-blue-200 text-sm">Conteúdo diário para reprogramar sua mente e quebrar o vício</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold">Controle Financeiro</h3>
                <p className="text-blue-200 text-sm">Veja quanto você está economizando ao não jogar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold">Apoio Emocional</h3>
                <p className="text-blue-200 text-sm">Comunidade e diário para registrar suas emoções</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 mb-6">
            <p className="text-emerald-400 text-sm text-center">
              💚 Você não está sozinho. Milhares de pessoas estão nessa jornada com você.
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen("home")}
            className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Começar Minha Jornada
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Navigation Component
  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 px-4 py-3 z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        <button
          onClick={() => setCurrentScreen("home")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            currentScreen === "home" ? "text-emerald-400" : "text-blue-300 hover:text-white"
          }`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-xs">Progresso</span>
        </button>
        <button
          onClick={() => setCurrentScreen("challenge")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            currentScreen === "challenge" ? "text-emerald-400" : "text-blue-300 hover:text-white"
          }`}
        >
          <Target className="w-6 h-6" />
          <span className="text-xs">Desafio</span>
        </button>
        <button
          onClick={() => setCurrentScreen("diary")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            currentScreen === "diary" ? "text-emerald-400" : "text-blue-300 hover:text-white"
          }`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs">Diário</span>
        </button>
        <button
          onClick={() => setCurrentScreen("finance")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            currentScreen === "finance" ? "text-emerald-400" : "text-blue-300 hover:text-white"
          }`}
        >
          <DollarSign className="w-6 h-6" />
          <span className="text-xs">Finanças</span>
        </button>
        <button
          onClick={() => setCurrentScreen("community")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            currentScreen === "community" ? "text-emerald-400" : "text-blue-300 hover:text-white"
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs">Comunidade</span>
        </button>
      </div>
    </nav>
  );

  // Home Screen - Progress
  if (currentScreen === "home") {
    const progress = (completedDays.length / 21) * 100;
    const motivationalPhrases = [
      "1% melhor hoje já é vitória.",
      "Você está vencendo, um dia de cada vez.",
      "Cada dia sem jogar é uma conquista real.",
      "Sua força é maior que qualquer impulso.",
      "O futuro que você quer está sendo construído agora."
    ];
    const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

    return (
      <>
        <CelebrationModal />
        <div className="min-h-screen pb-24 p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="max-w-lg mx-auto pt-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Olá, {userName || "Guerreiro"}! 👋</h2>
              <p className="text-blue-200">{randomPhrase}</p>
            </div>

            {/* Main Progress Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 mb-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4">
                  <span className="text-5xl font-bold text-white">{completedDays.length}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Dias Livre</h3>
                <p className="text-emerald-100">de 21 dias do desafio</p>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-4">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-white font-semibold">{Math.round(progress)}% completo</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <DollarSign className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-blue-200 text-sm mb-1">Economizado</p>
                <p className="text-2xl font-bold text-white">R$ {totalSaved.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Calendar className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-blue-200 text-sm mb-1">Sequência</p>
                <p className="text-2xl font-bold text-white">{completedDays.length} dias</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setCurrentScreen("challenge")}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-white font-semibold">Desafio do Dia {currentDay}</p>
                    <p className="text-blue-200 text-sm">Conteúdo disponível</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400" />
              </button>

              <button
                onClick={() => setCurrentScreen("diary")}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <div className="text-left">
                    <p className="text-white font-semibold">Como você está?</p>
                    <p className="text-blue-200 text-sm">Registre suas emoções</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-pink-400" />
              </button>
            </div>
          </div>
          <Navigation />
        </div>
      </>
    );
  }

  // Diary Screen
  if (currentScreen === "diary") {
    const moods = [
      { emoji: "😊", label: "Bem", color: "emerald" },
      { emoji: "😌", label: "Calmo", color: "blue" },
      { emoji: "😰", label: "Ansioso", color: "yellow" },
      { emoji: "😢", label: "Triste", color: "indigo" },
      { emoji: "😤", label: "Irritado", color: "red" },
      { emoji: "💪", label: "Forte", color: "teal" }
    ];

    const supportMessages = {
      "Bem": "Que ótimo ver você assim! Continue cuidando de si mesmo.",
      "Calmo": "A paz interior é um grande passo. Você está no caminho certo.",
      "Ansioso": "Respire fundo. A ansiedade passa. Você é mais forte que ela.",
      "Triste": "Está tudo bem sentir tristeza. Você não está sozinho nessa jornada.",
      "Irritado": "Reconhecer a raiva já é um grande passo. Ela vai passar.",
      "Forte": "Essa força é real! Continue assim, você está vencendo!"
    };

    return (
      <div className="min-h-screen pb-24 p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-lg mx-auto pt-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentScreen("home")}
              className="text-blue-300 hover:text-white flex items-center gap-2 mb-4"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Diário de Emoções</h1>
            <p className="text-blue-200">Como você está se sentindo hoje?</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-6">
            <h3 className="text-white font-semibold mb-4">Selecione seu humor</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    mood === m.label
                      ? "border-emerald-400 bg-emerald-500/20"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-4xl mb-2">{m.emoji}</div>
                  <p className="text-white text-sm font-medium">{m.label}</p>
                </button>
              ))}
            </div>

            {mood && (
              <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 mb-6">
                <p className="text-emerald-400 font-medium">
                  💚 {supportMessages[mood as keyof typeof supportMessages]}
                </p>
              </div>
            )}

            <h3 className="text-white font-semibold mb-3">Escreva sobre seu dia</h3>
            <textarea
              value={diaryEntry}
              onChange={(e) => setDiaryEntry(e.target.value)}
              placeholder="Como foi seu dia? O que você sentiu? Teve algum desafio?"
              className="w-full h-40 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />

            <button
              onClick={handleSaveDiary}
              disabled={!mood || !diaryEntry}
              className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar Registro
            </button>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  // Finance Screen
  if (currentScreen === "finance") {
    return (
      <div className="min-h-screen pb-24 p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-lg mx-auto pt-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentScreen("home")}
              className="text-blue-300 hover:text-white flex items-center gap-2 mb-4"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Painel Financeiro</h1>
            <p className="text-blue-200">Veja quanto você está economizando</p>
          </div>

          {/* Total Saved */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 mb-6 shadow-2xl text-center">
            <DollarSign className="w-16 h-16 text-white mx-auto mb-4" />
            <p className="text-emerald-100 mb-2">Total Economizado</p>
            <h2 className="text-5xl font-bold text-white mb-2">R$ {totalSaved.toFixed(2)}</h2>
            <p className="text-emerald-100">em {completedDays.length} dias livre</p>
          </div>

          {/* Add Amount */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-6">
            <h3 className="text-white font-semibold mb-4">Registrar economia</h3>
            <p className="text-blue-200 text-sm mb-4">
              Quanto você deixou de gastar hoje que normalmente gastaria em jogos?
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={handleAddSavings}
                disabled={!newAmount || parseFloat(newAmount) <= 0}
                className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 text-emerald-400 mb-2" />
              <p className="text-blue-200 text-sm mb-1">Média por dia</p>
              <p className="text-2xl font-bold text-white">
                R$ {completedDays.length > 0 ? (totalSaved / completedDays.length).toFixed(2) : "0.00"}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Calendar className="w-8 h-8 text-emerald-400 mb-2" />
              <p className="text-blue-200 text-sm mb-1">Dias registrados</p>
              <p className="text-2xl font-bold text-white">{completedDays.length}</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  // Community Screen
  if (currentScreen === "community") {
    // Posts de exemplo
    const examplePosts: Post[] = posts.length === 0 ? [
      {
        id: "1",
        user_id: "example1",
        user_name: "João Silva",
        message: "Hoje completei 7 dias sem jogar! Estou me sentindo mais leve e com mais energia. A comunidade tem sido fundamental nessa jornada. 💪",
        days_count: 7,
        likes: 12,
        claps: 8,
        awards: 3,
        comments: [
          { id: "c1", user: "Maria Santos", message: "Parabéns! Continue assim!", timestamp: "2h atrás" }
        ],
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        user_id: "example2",
        user_name: "Ana Costa",
        message: "Economizei R$ 500 este mês! Vou usar esse dinheiro para fazer uma viagem com minha família. Valeu muito a pena! 🎉",
        days_count: 14,
        likes: 25,
        claps: 15,
        awards: 7,
        comments: [],
        created_at: new Date().toISOString()
      }
    ] : posts;

    return (
      <div className="min-h-screen pb-24 p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-lg mx-auto pt-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentScreen("home")}
              className="text-blue-300 hover:text-white flex items-center gap-2 mb-4"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Comunidade</h1>
            <p className="text-blue-200">Você não está sozinho nessa jornada</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setCommunityTab("feed")}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                communityTab === "feed"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  : "bg-white/10 text-blue-300 hover:bg-white/20"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setCommunityTab("share")}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                communityTab === "share"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  : "bg-white/10 text-blue-300 hover:bg-white/20"
              }`}
            >
              Compartilhar
            </button>
          </div>

          {communityTab === "feed" ? (
            <>
              {/* Community Stats */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 mb-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 mb-1">Pessoas na jornada</p>
                    <h3 className="text-3xl font-bold text-white">1,247</h3>
                  </div>
                  <Users className="w-16 h-16 text-white/50" />
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {examplePosts.map((post) => (
                  <div key={post.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 relative">
                    {/* Animação de reação */}
                    {showReaction && showReaction.postId === post.id && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-ping">
                        <div className="text-6xl">
                          {showReaction.type === "like" && "❤️"}
                          {showReaction.type === "clap" && "👏"}
                          {showReaction.type === "award" && "🏆"}
                          {showReaction.type === "comment" && "💬"}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{post.user_name[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{post.user_name}</p>
                        <p className="text-emerald-400 text-sm">{post.days_count} dias livre</p>
                      </div>
                    </div>
                    <p className="text-blue-200 mb-4">{post.message}</p>
                    
                    {/* Interaction Buttons */}
                    <div className="flex gap-4 mb-4 pb-4 border-b border-white/10">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-all ${
                          post.userLiked ? "text-pink-400" : "text-blue-300 hover:text-pink-400"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.userLiked ? "fill-pink-400" : ""}`} />
                        <span className="text-sm font-semibold">{post.likes}</span>
                      </button>
                      <button
                        onClick={() => handleClap(post.id)}
                        className={`flex items-center gap-2 transition-all ${
                          post.userClapped ? "text-yellow-400" : "text-blue-300 hover:text-yellow-400"
                        }`}
                      >
                        <span className="text-xl">👏</span>
                        <span className="text-sm font-semibold">{post.claps}</span>
                      </button>
                      <button
                        onClick={() => handleAward(post.id)}
                        className={`flex items-center gap-2 transition-all ${
                          post.userAwarded ? "text-yellow-300" : "text-blue-300 hover:text-yellow-300"
                        }`}
                      >
                        <Award className={`w-5 h-5 ${post.userAwarded ? "fill-yellow-300" : ""}`} />
                        <span className="text-sm font-semibold">{post.awards}</span>
                      </button>
                      <button
                        onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                        className="flex items-center gap-2 text-blue-300 hover:text-emerald-400 transition-all"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">{post.comments.length}</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {showComments[post.id] && (
                      <div className="space-y-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="bg-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-semibold text-sm">{comment.user}</span>
                              <span className="text-blue-300 text-xs">{comment.timestamp}</span>
                            </div>
                            <p className="text-blue-200 text-sm">{comment.message}</p>
                          </div>
                        ))}
                        
                        {/* Add Comment */}
                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={newComment[post.id] || ""}
                            onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                            placeholder="Adicione um comentário..."
                            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                            className="p-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Share Progress Tab */
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Compartilhe seu progresso</h3>
              <p className="text-blue-200 text-sm mb-6">
                Inspire outras pessoas compartilhando sua jornada! Cada história de superação motiva alguém a continuar.
              </p>

              {/* Progress Summary */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-emerald-400 text-sm mb-1">Dias Livre</p>
                    <p className="text-3xl font-bold text-white">{completedDays.length}</p>
                  </div>
                  <div>
                    <p className="text-emerald-400 text-sm mb-1">Economizado</p>
                    <p className="text-3xl font-bold text-white">R$ {totalSaved.toFixed(0)}</p>
                  </div>
                </div>
                <p className="text-blue-200 text-sm">Esses números representam sua força e determinação! 💪</p>
              </div>

              {/* Post Input */}
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Compartilhe como você está se sentindo, seus desafios superados, ou uma mensagem de motivação..."
                className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none mb-4"
              />

              <button
                onClick={handleShareProgress}
                disabled={!newPost.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                Compartilhar na Comunidade
              </button>
            </div>
          )}
        </div>
        <Navigation />
      </div>
    );
  }

  // Challenge Screen
  if (currentScreen === "challenge") {
    const isCompleted = completedDays.includes(currentDay);

    return (
      <>
        <CelebrationModal />
        <div className="min-h-screen pb-24 p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="max-w-lg mx-auto pt-8">
            <div className="mb-6">
              <button
                onClick={() => setCurrentScreen("home")}
                className="text-blue-300 hover:text-white flex items-center gap-2 mb-4"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Voltar
              </button>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">Dia {currentDay} de 21</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentDay > 1) {
                        setCurrentDay(currentDay - 1);
                      }
                    }}
                    disabled={currentDay === 1}
                    className="p-2 bg-white/10 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (currentDay < 21) {
                        setCurrentDay(currentDay + 1);
                      }
                    }}
                    disabled={currentDay === 21}
                    className="p-2 bg-white/10 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-blue-200">Continue firme na sua jornada de libertação</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Desafio do Dia {currentDay}</h2>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <p className="text-white leading-relaxed mb-4">
                  Conteúdo motivacional e desafio do dia {currentDay}. Complete este desafio para avançar na sua jornada de 21 dias livre do vício.
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-emerald-400 font-semibold mb-2">📝 Tarefa de hoje:</p>
                  <p className="text-blue-200">Reflita sobre seu progresso e continue firme!</p>
                </div>
              </div>

              {!isCompleted ? (
                <button
                  onClick={() => handleDayCompletion(currentDay)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Concluir Dia {currentDay}
                </button>
              ) : (
                <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <p className="text-emerald-400 font-semibold">Dia concluído! Parabéns! 🎉</p>
                </div>
              )}
            </div>

            {/* Progress Timeline */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Seu Progresso</h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => setCurrentDay(day)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                      completedDays.includes(day)
                        ? "bg-emerald-500 text-white"
                        : day === currentDay
                        ? "bg-white/20 text-white border-2 border-emerald-400"
                        : "bg-white/5 text-blue-300 hover:bg-white/10"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Navigation />
        </div>
      </>
    );
  }

  return null;
}

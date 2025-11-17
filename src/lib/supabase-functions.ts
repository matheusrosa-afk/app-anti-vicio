import { supabase } from './supabase';

// ==================== USUÁRIOS ====================

export async function createUser(name: string, email: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ==================== PROGRESSO ====================

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .insert([{ 
      user_id: userId,
      completed_days: [],
      current_day: 1,
      total_saved: 0
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProgress(
  userId: string, 
  completedDays: number[], 
  currentDay: number, 
  totalSaved: number
) {
  const { data, error } = await supabase
    .from('user_progress')
    .update({ 
      completed_days: completedDays,
      current_day: currentDay,
      total_saved: totalSaved,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==================== DIÁRIO ====================

export async function createDiaryEntry(
  userId: string, 
  mood: string, 
  entry: string
) {
  const { data, error } = await supabase
    .from('diary_entries')
    .insert([{ 
      user_id: userId,
      mood,
      entry,
      date: new Date().toISOString().split('T')[0]
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getDiaryEntries(userId: string) {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
}

// ==================== COMUNIDADE ====================

export async function getCommunityPosts() {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createCommunityPost(
  userId: string,
  userName: string,
  message: string,
  daysCount: number
) {
  const { data, error } = await supabase
    .from('community_posts')
    .insert([{ 
      user_id: userId,
      user_name: userName,
      message,
      days_count: daysCount
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePostReactionCount(
  postId: string,
  reactionType: 'likes' | 'claps' | 'awards',
  increment: number
) {
  const { data, error } = await supabase.rpc('increment_reaction', {
    post_id: postId,
    reaction_column: reactionType,
    increment_by: increment
  });
  
  if (error) {
    // Fallback: buscar post atual e atualizar
    const { data: post } = await supabase
      .from('community_posts')
      .select(reactionType)
      .eq('id', postId)
      .single();
    
    if (post) {
      const newValue = (post[reactionType] || 0) + increment;
      await supabase
        .from('community_posts')
        .update({ [reactionType]: newValue })
        .eq('id', postId);
    }
  }
}

// ==================== COMENTÁRIOS ====================

export async function getPostComments(postId: string) {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function createComment(
  postId: string,
  userId: string,
  userName: string,
  message: string
) {
  const { data, error } = await supabase
    .from('post_comments')
    .insert([{ 
      post_id: postId,
      user_id: userId,
      user_name: userName,
      message
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==================== REAÇÕES ====================

export async function toggleReaction(
  postId: string,
  userId: string,
  reactionType: 'like' | 'clap' | 'award'
) {
  // Verificar se já existe
  const { data: existing } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .eq('reaction_type', reactionType)
    .single();
  
  if (existing) {
    // Remover reação
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .eq('id', existing.id);
    
    if (error) throw error;
    
    // Decrementar contador
    const columnMap = { like: 'likes', clap: 'claps', award: 'awards' };
    await updatePostReactionCount(postId, columnMap[reactionType] as any, -1);
    
    return { added: false };
  } else {
    // Adicionar reação
    const { error } = await supabase
      .from('post_reactions')
      .insert([{ 
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType
      }]);
    
    if (error) throw error;
    
    // Incrementar contador
    const columnMap = { like: 'likes', clap: 'claps', award: 'awards' };
    await updatePostReactionCount(postId, columnMap[reactionType] as any, 1);
    
    return { added: true };
  }
}

export async function getUserReactions(userId: string, postIds: string[]) {
  const { data, error } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('user_id', userId)
    .in('post_id', postIds);
  
  if (error) throw error;
  return data || [];
}

// ==================== SELEÇÕES ====================

export async function saveUserSelection(
  userId: string,
  day: number,
  selectionType: string,
  selections: string[]
) {
  const { data, error } = await supabase
    .from('user_selections')
    .upsert([{ 
      user_id: userId,
      day,
      selection_type: selectionType,
      selections
    }], {
      onConflict: 'user_id,day,selection_type'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserSelections(userId: string, day: number) {
  const { data, error } = await supabase
    .from('user_selections')
    .select('*')
    .eq('user_id', userId)
    .eq('day', day);
  
  if (error) throw error;
  return data;
}

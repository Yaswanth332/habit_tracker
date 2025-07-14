import { getConnection } from '../config/database';
import { Task, Goal, WorkSession, Reflection } from '../contexts/DataContext';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseService {
  // Tasks
  static async getAllTasks(): Promise<Task[]> {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT id, title, type, completed, streak, category, emoji, 
             due_date as dueDate, priority, tags, created_at as createdAt
      FROM tasks 
      ORDER BY created_at DESC
    `);
    
    return (rows as any[]).map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      completed: Boolean(row.completed)
    }));
  }

  static async createTask(task: Omit<Task, 'id' | 'createdAt' | 'streak'>): Promise<string> {
    const connection = getConnection();
    const id = uuidv4();
    
    await connection.execute(`
      INSERT INTO tasks (id, title, type, completed, streak, category, emoji, due_date, priority, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      task.title,
      task.type,
      task.completed,
      0,
      task.category,
      task.emoji,
      task.dueDate || null,
      task.priority,
      JSON.stringify(task.tags)
    ]);
    
    return id;
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const connection = getConnection();
    const fields = [];
    const values = [];
    
    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updates.completed);
    }
    if (updates.streak !== undefined) {
      fields.push('streak = ?');
      values.push(updates.streak);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.emoji !== undefined) {
      fields.push('emoji = ?');
      values.push(updates.emoji);
    }
    if (updates.dueDate !== undefined) {
      fields.push('due_date = ?');
      values.push(updates.dueDate || null);
    }
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      values.push(updates.priority);
    }
    if (updates.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }
    
    if (fields.length > 0) {
      values.push(id);
      await connection.execute(`
        UPDATE tasks SET ${fields.join(', ')} WHERE id = ?
      `, values);
    }
  }

  static async deleteTask(id: string): Promise<void> {
    const connection = getConnection();
    await connection.execute('DELETE FROM tasks WHERE id = ?', [id]);
  }

  // Goals
  static async getAllGoals(): Promise<Goal[]> {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT id, title, description, deadline, progress, subtasks, category, motivational_quote as motivationalQuote
      FROM goals 
      ORDER BY created_at DESC
    `);
    
    return (rows as any[]).map(row => ({
      ...row,
      subtasks: JSON.parse(row.subtasks || '[]')
    }));
  }

  static async createGoal(goal: Omit<Goal, 'id'>): Promise<string> {
    const connection = getConnection();
    const id = uuidv4();
    
    await connection.execute(`
      INSERT INTO goals (id, title, description, deadline, progress, subtasks, category, motivational_quote)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      goal.title,
      goal.description,
      goal.deadline,
      goal.progress,
      JSON.stringify(goal.subtasks),
      goal.category,
      goal.motivationalQuote || null
    ]);
    
    return id;
  }

  static async updateGoalProgress(id: string, progress: number): Promise<void> {
    const connection = getConnection();
    await connection.execute('UPDATE goals SET progress = ? WHERE id = ?', [progress, id]);
  }

  // Work Sessions
  static async getAllWorkSessions(): Promise<WorkSession[]> {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT id, project, duration, tags, date, notes, mood
      FROM work_sessions 
      ORDER BY date DESC, created_at DESC
    `);
    
    return (rows as any[]).map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }));
  }

  static async createWorkSession(session: Omit<WorkSession, 'id'>): Promise<string> {
    const connection = getConnection();
    const id = uuidv4();
    
    await connection.execute(`
      INSERT INTO work_sessions (id, project, duration, tags, date, notes, mood)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      session.project,
      session.duration,
      JSON.stringify(session.tags),
      session.date,
      session.notes,
      session.mood || null
    ]);
    
    return id;
  }

  // Reflections
  static async getAllReflections(): Promise<Reflection[]> {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT id, date, prompt, response, mood
      FROM reflections 
      ORDER BY date DESC, created_at DESC
    `);
    
    return rows as Reflection[];
  }

  static async createReflection(reflection: Omit<Reflection, 'id'>): Promise<string> {
    const connection = getConnection();
    const id = uuidv4();
    
    await connection.execute(`
      INSERT INTO reflections (id, date, prompt, response, mood)
      VALUES (?, ?, ?, ?, ?)
    `, [
      id,
      reflection.date,
      reflection.prompt,
      reflection.response,
      reflection.mood
    ]);
    
    return id;
  }

  // User Settings
  static async getTotalStreak(): Promise<number> {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT setting_value FROM user_settings WHERE setting_key = 'total_streak'
    `);
    
    const result = rows as any[];
    return result.length > 0 ? parseInt(result[0].setting_value) : 0;
  }

  static async updateTotalStreak(streak: number): Promise<void> {
    const connection = getConnection();
    await connection.execute(`
      INSERT INTO user_settings (setting_key, setting_value) 
      VALUES ('total_streak', ?) 
      ON DUPLICATE KEY UPDATE setting_value = ?
    `, [streak.toString(), streak.toString()]);
  }
}
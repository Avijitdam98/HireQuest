const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        chat_id: chatId,
        sender_id: senderId,
        content,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Emit real-time update
    await supabase
      .from('messages')
      .on('INSERT', payload => {
        // Handle real-time message
      })
      .subscribe();

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(id, full_name, avatar_url)
      `)
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { participants, type = 'direct' } = req.body;

    const { data, error } = await supabase
      .from('chats')
      .insert([{
        participants,
        type,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        participants:profiles(id, full_name, avatar_url),
        last_message:messages(content, timestamp)
      `)
      .contains('participants', [userId])
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.chatWithBot = async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Get user's profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a career and job matching assistant that helps users with their career-related queries. You have access to the user's profile and can provide personalized advice."
        },
        {
          role: "user",
          content: `User Profile: ${JSON.stringify(profile)}\n\nUser Message: ${message}`
        }
      ],
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content.trim();
    res.json({ response: botResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

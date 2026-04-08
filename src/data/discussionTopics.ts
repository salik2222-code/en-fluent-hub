export type DiscussionTopic = {
  title: string;
  emoji: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

export const discussionTopics: DiscussionTopic[] = [
  // ===== BEGINNER (10) =====
  { title: "My Favorite Hobbies", emoji: "🎨", difficulty: "Beginner" },
  { title: "My Pets and Animals", emoji: "🐾", difficulty: "Beginner" },
  { title: "Weekend Plans", emoji: "🗓️", difficulty: "Beginner" },
  { title: "My Favorite Food", emoji: "🍕", difficulty: "Beginner" },
  { title: "Movies I Like", emoji: "🎬", difficulty: "Beginner" },
  { title: "My Daily Routine", emoji: "⏰", difficulty: "Beginner" },
  { title: "Sports and Games", emoji: "⚽", difficulty: "Beginner" },
  { title: "My Dream Vacation", emoji: "✈️", difficulty: "Beginner" },
  { title: "Music I Enjoy", emoji: "🎵", difficulty: "Beginner" },
  { title: "Seasons and Weather", emoji: "🌤️", difficulty: "Beginner" },

  // ===== INTERMEDIATE (10) =====
  { title: "Technology in Daily Life", emoji: "💻", difficulty: "Intermediate" },
  { title: "Travel Experiences", emoji: "🌍", difficulty: "Intermediate" },
  { title: "Health and Fitness", emoji: "💪", difficulty: "Intermediate" },
  { title: "Social Media Impact", emoji: "📱", difficulty: "Intermediate" },
  { title: "Education Systems", emoji: "🎓", difficulty: "Intermediate" },
  { title: "Food Cultures Around the World", emoji: "🍜", difficulty: "Intermediate" },
  { title: "Environmental Awareness", emoji: "🌱", difficulty: "Intermediate" },
  { title: "Work-Life Balance", emoji: "⚖️", difficulty: "Intermediate" },
  { title: "Online Learning vs Classroom", emoji: "📚", difficulty: "Intermediate" },
  { title: "The Future of Transportation", emoji: "🚀", difficulty: "Intermediate" },

  // ===== ADVANCED (10) =====
  { title: "AI Ethics and Responsibility", emoji: "🤖", difficulty: "Advanced" },
  { title: "Remote Work vs Office Culture", emoji: "🏢", difficulty: "Advanced" },
  { title: "Global Economy Trends", emoji: "📈", difficulty: "Advanced" },
  { title: "Space Exploration Benefits", emoji: "🛰️", difficulty: "Advanced" },
  { title: "Digital Privacy and Security", emoji: "🔒", difficulty: "Advanced" },
  { title: "Sustainable Urban Development", emoji: "🏙️", difficulty: "Advanced" },
  { title: "The Role of Media in Society", emoji: "📰", difficulty: "Advanced" },
  { title: "Cultural Preservation vs Globalization", emoji: "🌐", difficulty: "Advanced" },
  { title: "Healthcare Innovation", emoji: "🏥", difficulty: "Advanced" },
  { title: "Entrepreneurship and Innovation", emoji: "💡", difficulty: "Advanced" },
];

export interface DemoUser {
  id: string;
  name: string;
  age: number;
  location: string;
  photos: string[];
  bio: string;
  interests: string[];
  isOnline: boolean;
  lastSeen?: string;
  verified?: boolean;
  height?: number;
  occupation?: string;
  education?: string;
  relationshipGoal?: 'casual' | 'serious' | 'long-term' | 'friendship';
  languages?: string[];
  hobbies?: string[];
  lifestyle?: {
    smoking?: 'never' | 'sometimes' | 'regularly';
    drinking?: 'never' | 'socially' | 'regularly';
    diet?: 'omnivore' | 'vegetarian' | 'vegan';
    pets?: 'none' | 'dog' | 'cat' | 'both' | 'other';
  };
  personality?: {
    extrovert?: boolean;
    creative?: boolean;
    organized?: boolean;
    adventurous?: boolean;
  };
  subscription?: 'free' | 'premium';
}

export const demoUsers: DemoUser[] = [
  {
    id: 'demo-1',
    name: 'Ольга',
    age: 36,
    location: 'Екатеринбург',
    photos: [
      'https://cdn.poehali.dev/files/a8633799-0bfc-4c85-925c-dfbfeff38e24.png',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b9d9e8da?w=600&h=800&fit=crop&crop=face'
    ],
    bio: 'Люблю природу, путешествия и новые знакомства. Ищу серьёзные отношения. Работаю менеджером в крупной компании, в свободное время увлекаюсь спортом и кулинарией.',
    interests: ['Путешествия', 'Спорт', 'Кулинария', 'Книги', 'Музыка', 'Природа'],
    isOnline: true,
    verified: true,
    height: 165,
    occupation: 'Менеджер по продажам',
    education: 'Высшее экономическое',
    relationshipGoal: 'long-term',
    languages: ['Русский', 'Английский'],
    hobbies: ['Йога', 'Фотография', 'Готовка', 'Пешие прогулки'],
    lifestyle: {
      smoking: 'never',
      drinking: 'socially',
      diet: 'omnivore',
      pets: 'cat'
    },
    personality: {
      extrovert: true,
      creative: true,
      organized: true,
      adventurous: true
    },
    subscription: 'free'
  },
  {
    id: 'demo-2',
    name: 'Анна',
    age: 28,
    location: 'Москва',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face'
    ],
    bio: 'Творческая личность, люблю искусство и театр. Работаю дизайнером в рекламном агентстве. Ищу единомышленника для совместного развития и ярких эмоций.',
    interests: ['Искусство', 'Театр', 'Музыка', 'Дизайн', 'Выставки', 'Кино'],
    isOnline: false,
    lastSeen: '2 часа назад',
    verified: true,
    height: 170,
    occupation: 'Графический дизайнер',
    education: 'Высшее художественное',
    relationshipGoal: 'serious',
    languages: ['Русский', 'Английский', 'Французский'],
    hobbies: ['Рисование', 'Посещение галерей', 'Керамика', 'Танцы'],
    lifestyle: {
      smoking: 'never',
      drinking: 'socially',
      diet: 'vegetarian',
      pets: 'none'
    },
    personality: {
      extrovert: false,
      creative: true,
      organized: true,
      adventurous: true
    },
    subscription: 'premium'
  },
  {
    id: 'demo-3',
    name: 'Мария',
    age: 32,
    location: 'Санкт-Петербург',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b9d9e8da?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop&crop=face'
    ],
    bio: 'Активная жизненная позиция, занимаюсь спортом и веду здоровый образ жизни. Фитнес-тренер и нутрициолог. Помогаю людям находить баланс между работой и здоровьем.',
    interests: ['Спорт', 'Здоровье', 'Йога', 'Бег', 'Плавание', 'Медитация'],
    isOnline: true,
    verified: false,
    height: 168,
    occupation: 'Фитнес-тренер',
    education: 'Высшее медицинское',
    relationshipGoal: 'serious',
    languages: ['Русский', 'Английский'],
    hobbies: ['Марафоны', 'Велоспорт', 'Здоровое питание', 'Массаж'],
    lifestyle: {
      smoking: 'never',
      drinking: 'never',
      diet: 'vegetarian',
      pets: 'dog'
    },
    personality: {
      extrovert: true,
      creative: false,
      organized: true,
      adventurous: true
    },
    subscription: 'free'
  },
  {
    id: 'demo-4',
    name: 'Елена',
    age: 29,
    location: 'Новосибирск',
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop&crop=face'
    ],
    bio: 'Путешественница со стажем, изучаю культуры мира. Работаю гидом-переводчиком. Ищу спутника для новых приключений и открытий. Мечтаю посетить все континенты.',
    interests: ['Путешествия', 'Культура', 'Языки', 'История', 'География', 'Архитектура'],
    isOnline: false,
    lastSeen: '5 минут назад',
    verified: true,
    height: 163,
    occupation: 'Гид-переводчик',
    education: 'Высшее лингвистическое',
    relationshipGoal: 'long-term',
    languages: ['Русский', 'Английский', 'Немецкий', 'Итальянский'],
    hobbies: ['Пешие походы', 'Фотография путешествий', 'Изучение языков', 'Коллекционирование сувениров'],
    lifestyle: {
      smoking: 'never',
      drinking: 'socially',
      diet: 'omnivore',
      pets: 'none'
    },
    personality: {
      extrovert: true,
      creative: true,
      organized: true,
      adventurous: true
    },
    subscription: 'premium'
  },
  {
    id: 'demo-5',
    name: 'Дарья',
    age: 26,
    location: 'Казань',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&h=800&fit=crop&crop=face'
    ],
    bio: 'IT-специалист, увлекаюсь технологиями и инновациями. Разработчик мобильных приложений. В свободное время читаю книги, играю в настольные игры и изучаю новые технологии.',
    interests: ['Технологии', 'Книги', 'Наука', 'Программирование', 'Игры', 'Астрономия'],
    isOnline: true,
    verified: false,
    height: 172,
    occupation: 'Мобильный разработчик',
    education: 'Высшее техническое',
    relationshipGoal: 'serious',
    languages: ['Русский', 'Английский'],
    hobbies: ['Программирование', 'Чтение научпопа', 'Настольные игры', 'Квесты'],
    lifestyle: {
      smoking: 'never',
      drinking: 'sometimes',
      diet: 'omnivore',
      pets: 'cat'
    },
    personality: {
      extrovert: false,
      creative: true,
      organized: true,
      adventurous: false
    },
    subscription: 'free'
  },
  {
    id: 'demo-6',
    name: 'Виктория',
    age: 31,
    location: 'Краснодар',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=600&h=800&fit=crop&crop=face'
    ],
    bio: 'Люблю готовить и экспериментировать с кухнями мира. Шеф-повар в ресторане авторской кухни. Мечтаю найти человека для создания крепкой семьи и совместного счастья.',
    interests: ['Кулинария', 'Семья', 'Дом', 'Рестораны', 'Вино', 'Садоводство'],
    isOnline: false,
    lastSeen: '1 день назад',
    verified: false,
    height: 160,
    occupation: 'Шеф-повар',
    education: 'Среднее специальное',
    relationshipGoal: 'long-term',
    languages: ['Русский'],
    hobbies: ['Готовка', 'Выпечка', 'Садоводство', 'Домашний уют'],
    lifestyle: {
      smoking: 'never',
      drinking: 'socially',
      diet: 'omnivore',
      pets: 'both'
    },
    personality: {
      extrovert: true,
      creative: true,
      organized: true,
      adventurous: false
    },
    subscription: 'free'
  }
];

export const getDemoUserById = (id: string): DemoUser | null => {
  return demoUsers.find(user => user.id === id) || null;
};
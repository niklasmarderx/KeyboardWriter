import { CodeSnippet } from './types';

// Ruby Snippets
export const RUBY_SNIPPETS: CodeSnippet[] = [
  {
    id: 'ruby-hello',
    language: 'ruby',
    title: 'Hello World',
    code: `puts "Hello, World!"`,
    difficulty: 'beginner',
  },
  {
    id: 'ruby-variables',
    language: 'ruby',
    title: 'Variables & Types',
    code: `name = "Ruby"
version = 3.2
is_dynamic = true
items = ["apple", "banana", "orange"]

puts "Language: #{name} version #{version}"
items.each { |item| puts item }`,
    difficulty: 'beginner',
  },
  {
    id: 'ruby-class',
    language: 'ruby',
    title: 'Classes & Modules',
    code: `class User
  attr_accessor :name, :email

  def initialize(name, email)
    @name = name
    @email = email
  end

  def to_s
    "#{name} <#{email}>"
  end
end

module Authenticatable
  def authenticate(password)
    BCrypt::Password.new(password_digest) == password
  end
end`,
    difficulty: 'intermediate',
  },
  {
    id: 'ruby-blocks',
    language: 'ruby',
    title: 'Blocks & Iterators',
    code: `numbers = [1, 2, 3, 4, 5]

squared = numbers.map { |n| n ** 2 }
evens = numbers.select { |n| n.even? }
sum = numbers.reduce(0) { |acc, n| acc + n }

numbers.each_with_index do |num, index|
  puts "Index #{index}: #{num}"
end`,
    difficulty: 'intermediate',
  },
  {
    id: 'ruby-rails-model',
    language: 'ruby',
    title: 'Rails Model',
    code: `class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_one :profile
  belongs_to :organization

  validates :email, presence: true, uniqueness: true
  validates :name, length: { minimum: 2, maximum: 50 }

  scope :active, -> { where(active: true) }
  scope :admins, -> { where(role: 'admin') }

  before_save :normalize_email

  private

  def normalize_email
    self.email = email.downcase.strip
  end
end`,
    difficulty: 'advanced',
  },
];

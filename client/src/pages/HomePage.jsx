import CategoryItem from "../components/CategoryItem";

function HomePage() {
  // Define your categories here. No state needed as this data is static.
  // Replace 'your-image-path.jpg' with the actual local paths once you have them.
  const categories = [
    {
      id: 1,
      name: "Electronics",
      image: '/electronics.png', // Use imported image variable
      description: "Discover the latest in tech, gadgets, and smart devices.",
      link: "/products?category=electronics" // Link to a category-specific page
    },
    {
      id: 2,
      name: "Apparel",
      image: '/apparel.png',
      description: "Fashion for all seasons, from casual wear to formal attire.",
      link: "/products?category=apparel"
    },
    {
      id: 3,
      name: "Home Goods",
      image: '/homegoods.png',
      description: "Everything you need to make your house a home.",
      link: "/products?category=home-goods"
    },
    {
      id: 4,
      name: "Books",
      image: '/books.png',
      description: "Dive into new worlds with our extensive collection.",
      link: "/products?category=books"
    },
    {
      id: 5,
      name: "Sports & Outdoors",
      image: '/sports.png',
      description: "Gear up for your next adventure or workout session.",
      link: "/products?category=sports-outdoors"
    },
    {
      id: 6,
      name: "Beauty & Personal Care",
      image: '/beauty.png',
      description: "Enhance your natural glow with our premium selections.",
      link: "/products?category=beauty-personal-care"
    }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1
          className="text-4xl md:text-5xl font-bold text-center mb-12
          bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        >
          Explore Our Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mx-8">
          {categories.map(category => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

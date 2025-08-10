// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  const hasAuth = typeof window !== 'undefined' && !!localStorage.getItem('authEmail');
  if (hasAuth) {
    window.location.href = '/plan';
  } else {
    window.location.href = '/login';
  }
  return null;
};

export default Index;

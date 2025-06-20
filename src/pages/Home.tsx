import PostList from "../components/PostList";

export const Home = () => {
    return (
        <div className="pt-24 px-4 min-h-screen bg-black text-white">
            <h2 className="text-3xl font-bold mb-6 text-fuchsia-500 text-center">Recent Posts</h2>
            <PostList />
        </div>
    );
};

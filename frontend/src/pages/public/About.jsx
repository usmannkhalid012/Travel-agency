import PageHeader from '../../components/PageHeader';

export default function About() {
  return (
    <div className="section-padding mx-auto max-w-5xl">
      <PageHeader title="About Travel Agency" subtitle="Built for premium travel booking with a modern UI, role-based access, and scalable MERN architecture." />
      <div className="glass-card rounded-3xl p-8 space-y-4 text-slate-300">
        <p>Travel Agency is designed to streamline intercity travel booking for customers while giving operators a polished admin dashboard.</p>
        <p>It includes authentication, seat selection, booking tracking, analytics, and deployment-ready configuration for Vercel, Render, and MongoDB Atlas.</p>
      </div>
    </div>
  );
}
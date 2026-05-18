import PageHeader from '../../components/PageHeader';

export default function Contact() {
  return (
    <div className="section-padding mx-auto max-w-5xl">
      <PageHeader title="Contact" subtitle="Use this page for support, route inquiries, or booking help." />
      <form className="glass-card grid gap-4 rounded-3xl p-6 md:grid-cols-2">
        <input className="input-field" placeholder="Your name" />
        <input className="input-field" placeholder="Email address" />
        <textarea className="input-field min-h-40 md:col-span-2" placeholder="Message" />
        <button className="btn-primary md:col-span-2">Send message</button>
      </form>
    </div>
  );
}
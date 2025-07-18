import ContactForm from "@/components/ContactForm";

const ContactPage = () => {
  return (
    <main className="max-h-screen bg-[#E6E8FF] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2D2E5F]">
          Humans Helping Humans (and AIs)
        </h1>
        <p className="text-2xl text-white font-semibold mt-2">
          Have a question about Yooly?<br/>Let&apos;s make it simple — reach out below.
        </p>
      </div>
      <ContactForm />
    </main>
  );
};

export default ContactPage;

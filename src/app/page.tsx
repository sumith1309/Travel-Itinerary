// Phase 1: Placeholder page — full homepage built in Phase 2
// This ensures Next.js builds without errors during backend development

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-sand flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-6">
        <h1 className="font-display text-4xl text-brand-forest mb-4">
          Trails and Miles
        </h1>
        <p className="text-brand-stone text-lg mb-8">
          Smart Travel Planning for Indian Travellers
        </p>
        <div className="bg-white rounded-2xl p-6 shadow-card text-left">
          <h2 className="font-semibold text-brand-midnight mb-4">Phase 1 — API Layer</h2>
          <ul className="space-y-2 text-sm text-brand-stone">
            <li>✅ Database schema (25+ models)</li>
            <li>✅ Authentication (NextAuth + Google OAuth)</li>
            <li>✅ Destination APIs</li>
            <li>✅ Itinerary generation (Claude AI)</li>
            <li>✅ Chatbot with SSE streaming</li>
            <li>✅ Visa Hub</li>
            <li>✅ Personalization engine</li>
            <li>✅ Search</li>
          </ul>
          <p className="mt-4 text-xs text-brand-stone">
            Frontend (Phase 2) coming soon. API docs available at{' '}
            <code className="font-mono bg-brand-sand px-1 rounded">/api/*</code>
          </p>
        </div>
      </div>
    </main>
  );
}

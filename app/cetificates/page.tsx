export default function CertificatesPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Certificates</h1>
      <div className="grid gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">AWS Cloud Practitioner</h2>
          <p className="text-muted-foreground">Amazon • 2023</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Oracle Cloud Infrastructure (OCI) Associate</h2>
          <p className="text-muted-foreground">Oracle • 2022</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">AWS Solutions Architect (In Progress)</h2>
          <p className="text-muted-foreground">Amazon • Expected 2024</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Data Science (In Progress)</h2>
          <p className="text-muted-foreground">Coursera • Expected 2024</p>
        </div>
      </div>
    </div>
  );
}
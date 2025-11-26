import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore as adminDb } from '@/lib/firebaseAdmin';
import type { Program } from '@/lib/types';


export async function generateStaticParams() {
  if (adminDb) {
    const snapshot = await adminDb.collection('programs').get();
    return snapshot.docs.map((d) => ({ id: d.id }));
  }

  if (!db) return [];

  const programsCol = collection(db!, 'programs');
  const programSnapshot = await getDocs(programsCol);
  return programSnapshot.docs.map((doc) => ({ id: doc.id }));
}

async function getProgram(id: string): Promise<Program | null> {
  if (adminDb) {
    const d = await adminDb.collection('programs').doc(id).get();
    if (!d.exists) return null;
    return { id: d.id, ...(d.data() as Program) };
  }

  if (!db) return null;

  const programDocRef = doc(db!, 'programs', id);
  const programSnap = await getDoc(programDocRef);
  if (!programSnap.exists()) return null;
  return { id: programSnap.id, ...(programSnap.data() as Program) };
}

export async function generateMetadata({ params }: Props) {
  const program = await getProgram(params.id);
  if (!program) {
    return { title: 'Program Not Found' };
  }
  return {
    title: `${program.title} | SEQHER`,
    description: program.summary,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const program = await getProgram(params.id);

  if (!program) {
    notFound();
  }

  const programImage = PlaceHolderImages.find((p) => p.id === program.imageId);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/programs" className="text-sm text-primary hover:underline">
            &larr; Back to Programs
          </Link>
        </div>

        <article className="space-y-8">
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary">{program.title}</h1>
          
          <div className="flex flex-wrap gap-2">
            {program.sdgGoals.map((goal) => (
              <Badge key={goal} variant="default" className="bg-accent text-accent-foreground">
                SDG {goal}
              </Badge>
            ))}
          </div>

          {programImage && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src={programImage.imageUrl}
                alt={program.title}
                fill
                className="object-cover"
                data-ai-hint={programImage.imageHint}
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="lead text-xl text-muted-foreground">{program.summary}</p>
            <p>{program.description}</p>
          </div>

          <div className="pt-8 border-t">
              <h3 className="font-headline text-2xl font-semibold mb-4">Get Involved</h3>
              <p className="mb-6 text-muted-foreground">Your support can make a real difference in the success of this program and others like it.</p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/donate">Donate Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/appointment">Volunteer</Link>
                </Button>
              </div>
          </div>
        </article>
      </div>
    </div>
  );
}

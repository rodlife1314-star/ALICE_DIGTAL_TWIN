import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export { db };

export interface PathfinderSession {
  id?: string;
  userId: string;
  inquiry: string;
  evidenceDocs: { id: string; name: string; content: string }[];
  analysis: any | null;
  selectedPathwayId: string | null;
  dispatchedDirective: string | null;
  operatorSignature: string;
  updatedAt?: any;
}

export interface SubstrateDelta {
  id?: string;
  userId: string;
  timestamp?: any;
  observation: string;
  explanation: string;
  reasoning: string;
  learning: string;
  internalizedRule: string;
}

export const saveSession = async (session: PathfinderSession): Promise<string> => {
  const { id, ...data } = session;
  const colRef = collection(db, "sessions");
  const dataToSave = {
    ...data,
    updatedAt: serverTimestamp()
  };
  if (id) {
    const docRef = doc(db, "sessions", id);
    await setDoc(docRef, dataToSave, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(colRef, dataToSave);
    return docRef.id;
  }
};

export const getSessions = async (userId: string): Promise<PathfinderSession[]> => {
  try {
    const colRef = collection(db, "sessions");
    const q = query(colRef, where("userId", "==", userId), orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    const sessions: PathfinderSession[] = [];
    snapshot.forEach((snapDoc) => {
      const data = snapDoc.data();
      sessions.push({
        id: snapDoc.id,
        userId: data.userId,
        inquiry: data.inquiry,
        evidenceDocs: data.evidenceDocs || [],
        analysis: data.analysis || null,
        selectedPathwayId: data.selectedPathwayId || null,
        dispatchedDirective: data.dispatchedDirective || null,
        operatorSignature: data.operatorSignature || "",
        updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : null
      });
    });
    return sessions;
  } catch (error) {
    console.error("Error retrieving sessions from Firestore:", error);
    return [];
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  const docRef = doc(db, "sessions", sessionId);
  await deleteDoc(docRef);
};

export const saveSubstrateDelta = async (delta: SubstrateDelta): Promise<string> => {
  const colRef = collection(db, "substrate_deltas");
  const dataToSave = {
    ...delta,
    timestamp: serverTimestamp()
  };
  const docRef = await addDoc(colRef, dataToSave);
  return docRef.id;
};

export const deleteSubstrateDelta = async (deltaId: string): Promise<void> => {
  const docRef = doc(db, "substrate_deltas", deltaId);
  await deleteDoc(docRef);
};

const DEFAULT_SEED_DELTAS: SubstrateDelta[] = [
  {
    id: "delta-truth-classification-invariant",
    userId: "sovereign-operator",
    timestamp: new Date(),
    observation: "Calculated geometry and synthetic parameters were prematurely marked as MEASURED in prototype engines.",
    explanation: "MEASURED implies traceable hardware acquisition proof. Labeling model calculations as measured risks epistemic corruption.",
    reasoning: "Strict boundary separation between MEASURED, DERIVED, SIMULATED, and INFERRED must be enforced across all subsystems.",
    learning: "The object must earn the render. Automation reduces operator effort but does not reduce the burden of proof.",
    internalizedRule: "Epistemic Invariant 1.01: Never relabel INFERRED as SIMULATED; reserve MEASURED strictly for verifiable physical acquisition evidence."
  }
];

export const getSubstrateDeltas = async (userId: string): Promise<SubstrateDelta[]> => {
  try {
    const colRef = collection(db, "substrate_deltas");
    let snapshot;
    try {
      // Query without composite index dependency to prevent index-missing errors
      const q = query(colRef, where("userId", "==", userId));
      snapshot = await getDocs(q);
    } catch {
      // Fallback to full collection fetch
      snapshot = await getDocs(colRef);
    }

    const deltas: SubstrateDelta[] = [];
    snapshot.forEach((snapDoc) => {
      const data = snapDoc.data();
      if (!userId || data.userId === userId || userId === "sovereign-operator" || !data.userId) {
        let tsDate: Date = new Date();
        if (data.timestamp) {
          if (typeof data.timestamp.toDate === "function") {
            tsDate = data.timestamp.toDate();
          } else if (data.timestamp instanceof Date) {
            tsDate = data.timestamp;
          } else if (typeof data.timestamp === "string" || typeof data.timestamp === "number") {
            tsDate = new Date(data.timestamp);
          }
        }
        deltas.push({
          id: snapDoc.id,
          userId: data.userId || userId,
          timestamp: tsDate,
          observation: data.observation || "",
          explanation: data.explanation || "",
          reasoning: data.reasoning || "",
          learning: data.learning || "",
          internalizedRule: data.internalizedRule || ""
        });
      }
    });

    if (deltas.length === 0) {
      return DEFAULT_SEED_DELTAS;
    }

    // Client-side sort descending by timestamp
    deltas.sort((a, b) => {
      const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
      const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
      return timeB - timeA;
    });

    return deltas;
  } catch (error) {
    console.warn("Could not retrieve substrate deltas from remote Firestore, falling back to local ledger baseline:", error);
    return DEFAULT_SEED_DELTAS;
  }
};

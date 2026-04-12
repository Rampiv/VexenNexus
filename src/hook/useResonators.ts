import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Resonator } from '../types/resonator';

export const useResonators = () => {
  const [resonators, setResonators] = useState<Resonator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResonators = async () => {
      try {
        const q = query(collection(db, 'resonators'), orderBy('name'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Resonator[];
        setResonators(data);
      } catch (error) {
        console.error("Ошибка загрузки всех резонаторов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResonators();
  }, []);

  return { resonators, loading };
};
import { useAuth } from "@clerk/clerk-react";

 
export default function useFetch() {
  const { getToken } = useAuth();
 
  const authenticatedFetch = async (...args: any[]) => {
    return fetch(...args, {
      headers: { Authorization: `Bearer ${await getToken()}` }
    }).then(res => res.json());
  };
 
  return authenticatedFetch;
}
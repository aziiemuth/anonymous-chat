export const parseSupabaseDate = (dateString: string): Date => {
  // If the date string from Supabase does not have timezone info, it is inherently UTC.
  // Appending 'Z' explicitly tells JS Date constructor to treat it as UTC, avoiding
  // browser local timezone assumption before conversion.
  const isUTC = dateString.endsWith('Z') || dateString.includes('+');
  const safeDateString = isUTC ? dateString : `${dateString}Z`;
  return new Date(safeDateString);
};

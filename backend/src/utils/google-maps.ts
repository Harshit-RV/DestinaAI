import config from "../config";

const googleApiKey = "AIzaSyAK6_VUmR2XBmpgn91rf54ulxC0wruOd3I";

async function getPlaceId(hotelName: string, latitude: number, longitude: number): Promise<string | null> {
  const input = encodeURIComponent(hotelName);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&locationbias=point:${latitude},${longitude}&key=${googleApiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].place_id;
  }
  return null;
}

async function getPhotoReference(placeId: string): Promise<string[] | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${googleApiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.result && data.result.photos && data.result.photos.length > 0) {
    return await Promise.all(data.result.photos.map(async (photo: any) => {
      const photoUrl = await getPhotoUrl(photo.photo_reference);
      return photoUrl;
    }));
  }
  return null;
}

function getPhotoUrl(photoReference: string, maxWidth: number = 4800): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${googleApiKey}`;
}

export async function getHotelPhotoUrl(
  hotelName: string,
  latitude: number,
  longitude: number
): Promise<string[] | null> {
  const placeId = await getPlaceId(hotelName, latitude, longitude);
  if (!placeId) {
    console.error('Place ID not found');
    return null;
  }
  const photoReference = await getPhotoReference(placeId);
  if (!photoReference) {
    console.error('Photo reference not found');
    return null;
  }
  return photoReference;
}

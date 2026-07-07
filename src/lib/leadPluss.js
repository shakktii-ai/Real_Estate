export async function createLeadPlussLead({
  FirstName,
  LastName = "",
  ISD = "+91",
  Phone,
  EmailId = "",
  State = "",
  City = "",
  Location = "",
  Project = "",
  Pincode = "",
  PropertyFor = "Buy",
  Property = "Flat",
  PropertyType = "",
  Message = "",
  LeadSource = "Website",
  budget = "",
}) {
  const payload = {
    FirstName,
    LastName,
    ISD,
    Phone,
    EmailId,
    State,
    City,
    Location,
    Project,
    Pincode,
    PropertyFor,
    Property,
    PropertyType,
    Message,
    LeadSource,
    budget,
    vendor_key: process.env.LEADPLUSS_VENDOR_KEY,
  };
console.log("LeadPluss Payload");
console.log(JSON.stringify(payload, null, 2));
  const response = await fetch(process.env.LEADPLUSS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

console.log("LeadPluss Status:", response.status);
console.log("LeadPluss Response:", data);
  return {
    status: response.status,
    data,
  };
}




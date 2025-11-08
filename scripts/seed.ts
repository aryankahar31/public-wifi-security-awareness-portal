import { supabase } from "/home/rootme/dev/python/public-wi-fi-security-awareness-research-portal/supabase/client.ts";
import { RAW_DATA } from "/home/rootme/dev/python/public-wi-fi-security-awareness-research-portal/services/surveyData.ts"; // adjust path if your file is in different folder

async function seedData() {
  console.log("🚀 Starting data seeding...");

  for (const item of RAW_DATA) {
    const mapped = {
      created_at: item["Timestamp"],
      email_address: item["Email Address"],
      name: item["Name"],
      age_group: item["What is your age group?"],
      occupation: item["What is your occupation?"],
      wifi_frequency: item["How often do you use public wifi?"],
      connection_location: item["Where do you most often connect to public wifi?"],
      wifi_importance: item["How important is public wifi to you in your daily routine?"],
      activities: item["What activities do you usually perform on public wifi?"],
      awareness_risk: item["Are you aware that using public wifi can pose security risk (eg. data theft, hacking, etc)?"],
      security_measures: item["Do you use any security measures while using public wifi?"],
      security_issues: item["Have you ever faced any security issues while using public wifi (eg. hacking, data lost, suspicious activity)?"],
      security_feeling: item["How secure do you feel while using public wifi?"],
      alternatives: item["If public wifi was not available what alternatives would you prefer?"],
      pay_for_wifi: item["Would you be willing to pay a small fee for safer and more secure public Wi-Fi?"],
      connection_factors: item["What factors influence your decision to connect to a public Wi-Fi network?"],
      reads_terms: item["Do you read the terms and conditions before connecting to public Wi-Fi?"],
      responsibility: item["In your opinion who should be responsible for ensuring public Wi-Fi security?"],
      score: item["Score"],
    };

    const { error } = await supabase.from("survey_responses").insert(mapped);

    if (error) {
      console.error("❌ Error inserting:", error);
      return;
    }
  }

  console.log("✅ Seeding complete! All data uploaded to Supabase.");
}

seedData();

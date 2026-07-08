export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = "ak_f638ueqccg1f2tcpsc2lalu3";

  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { events } = req.body;

  if (!Array.isArray(events)) {
    return res.status(400).json({ error: "Invalid events" });
  }

  const users = new Set();
  let revenue = 0;
  const userTotals = {};

  for (const event of events) {
    users.add(event.user);

    const amount = Number(event.amount);

    if (amount > 0) {
      revenue += amount;

      if (!userTotals[event.user]) {
        userTotals[event.user] = 0;
      }

      userTotals[event.user] += amount;
    }
  }

  let topUser = null;
  let highest = -Infinity;

  for (const user in userTotals) {
    if (userTotals[user] > highest) {
      highest = userTotals[user];
      topUser = user;
    }
  }

  return res.status(200).json({
    email: "24f2001517@ds.study.iitm.ac.in",
    total_events: events.length,
    unique_users: users.size,
    revenue: Number(revenue.toFixed(2)),
    top_user: topUser
  });
}

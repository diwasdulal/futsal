import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendBookingConfirmation = async (email, details) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Booking Confirmation",
    html: `<h3>Your Booking is Confirmed!</h3>
           <p><strong>Court:</strong> ${details.court}</p>
           <p><strong>Date:</strong> ${details.date}</p>
           <p><strong>Time:</strong> ${details.start_time} - ${details.end_time}</p>
           <p>Thank you for booking with us!</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendTournamentAlert = async (email, tournament) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Upcoming Tournament Reminder",
    html: `
      <h3>Upcoming Tournament Alert</h3>
      <p><strong>${tournament.name}</strong> starts on <strong>${tournament.start_date}</strong></p>
      <p>Make sure your team is ready!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendCancellationEmail = async (email, details) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Booking Cancellation Confirmation",
    html: `
      <h3>Your Booking Has Been Cancelled</h3>
      <p>Your booking for Court ${details.court_id} on ${details.date} at ${details.start_time} has been cancelled.</p>
      <p>We hope to see you again soon!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendSlotOpeningEmail = async (email, details) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "A Slot Has Opened Up!",
    html: `
      <h3>A New Slot is Available for Booking!</h3>
      <p>A new slot is available for Court ${details.court_id} on ${details.date} at ${details.start_time}.</p>
      <p>Book now before someone else does!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

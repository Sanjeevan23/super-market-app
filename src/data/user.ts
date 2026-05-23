export type AppUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  dob: string;
};

export const USERS: AppUser[] = [
  {
    id: "1",
    username: "sanjeevan",
    firstName: "Sanjeevan",
    lastName: "Yogan",
    phoneNumber: "0762360948",
    email: "sanjeevan@gmail.com",
    password: "Pass@123",
    dob: "2002-23-08",
  },
  {
    id: "2",
    username: "rahman",
    firstName: "Rahman",
    lastName: "Rahman",
    phoneNumber: "0712345678",
    email: "rahman@gmail.com",
    password: "Pass@123",
    dob: "1998-06-21",
  },
  {
    id: "3",
    username: "Nihal",
    firstName: "Nihal",
    lastName: "",
    phoneNumber: "0778899001",
    email: "Nihal@gmail.com",
    password: "Pass@123",
    dob: "1995-11-03",
  },
];

export const findUserByIdentifier = (identifier: string) => {
  const value = identifier.trim().toLowerCase();

  return (
    USERS.find((user) => user.email.toLowerCase() === value) ||
    USERS.find((user) => user.username.toLowerCase() === value) ||
    null
  );
};
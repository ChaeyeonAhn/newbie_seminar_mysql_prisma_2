const express = require('express');
const app = express();
const port = 8080;


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());

app.post('/account/:account_no/withdraw', async (req, res) => {
  const { account_no } = req.params;
  const { firstName, lastName, amount } = req.body;

  const accNumber = parseInt(account_no);

  if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount specified" });
  }

  try {
      const account = await prisma.account.findUnique({
          where: { accNumber: accNumber }
      });

      const balance = await prisma.account.findMany({
        where: {
          accNumber: accNumber
        },
        select: {
          balance: true
        }
      });

      const bal = balance.map((e) => (
        e.balance
      ));

      const firstname = await prisma.owns.findMany({
        where: {
          accNumber: accNumber
        },
        select: {
          Customer: {
            select: {
              firstName: true
            }
          }
        }
      });

      const first = firstname.map(e => (
        e.Customer.firstName
      ));

      const lastname = await prisma.owns.findMany({
        where: {
          accNumber: accNumber
        },
        select: {
          Customer: {
            select: {
              lastName: true
            }
          }
        }
      });

      const last = lastname.map(e => (
        e.Customer.lastName
      ));


      if (!account) {
          return res.status(404).json({ error: "Account not found" });
      }

      if ((first != firstName) || (last != lastName)) {
          return res.status(403).json({ error: "Access denied: You do not own this account" });
      }

      if ((bal < amount) || (bal < 0)) {
          return res.status(400).json({ error: "Insufficient balance" });
      }

      const total = parseInt(bal) - amount;
      
    
      const final = total.toString;

      const updatedAccount = await prisma.account.update({
          where: { accNumber: accNumber },
          data: { balance: (total).toString() }
      });

      res.status(200).json({ balance: updatedAccount.balance });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
});


app.post('/account/:account_no/deposit', async (req, res) => {
  const { account_no } = req.params;
  const { firstName, lastName, amount } = req.body;

  const accNumber = parseInt(account_no);

  if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount specified" });
  }

  try {
      const account = await prisma.account.findUnique({
          where: { accNumber: accNumber }
      });

      const balance = await prisma.account.findMany({
        where: {
          accNumber: accNumber
        },
        select: {
          balance: true
        }
      });

      const bal = balance.map((e) => (
        e.balance
      ));

      const firstname = await prisma.owns.findMany({
        where: {
          accNumber: accNumber
        },
        select: {
          Customer: {
            select: {
              firstName: true
            }
          }
        }
      });

      const first = firstname.map(e => (
        e.Customer.firstName
      ));

      const lastname = await prisma.owns.findMany({
        where: {
          accNumber: accNumber
        },
        select: {
          Customer: {
            select: {
              lastName: true
            }
          }
        }
      });

      const last = lastname.map(e => (
        e.Customer.lastName
      ));


      if (!account) {
          return res.status(404).json({ error: "Account not found" });
      }

      if ((first != firstName) || (last != lastName)) {
          return res.status(403).json({ error: "Access denied: You do not own this account" });
      }

      const total = parseInt(bal) + amount;
    
      const updatedAccount = await prisma.account.update({
          where: { accNumber: accNumber },
          data: { balance: total.toString() }
      });

      res.status(200).json({ balance: updatedAccount.balance });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
});




app.get('/', (req, res) => {
  res.send('chacha Assignment');
});

app.listen(port, () => {
  console.log(`서버 실행 : http://localhost:${port}`);
});
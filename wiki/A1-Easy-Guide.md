# A1 Easy Guide — For AI Agent Users

**Get A1 running on your computer, step by step.**

---

## What is A1?

A1 gives your AI agent a cryptographic identity — like a passport. When your agent tries to do something (read a file, search the web, send an email, execute a trade), A1 checks:

- Is this agent allowed to do this?
- Did a real human (you) actually approve it?
- Is the approval still valid?

If anything is wrong, the action is blocked. Every approved action gets a tamper-proof receipt. You stay in control.

---

## Step 1 — Open your terminal

The terminal is a text window where you type commands. You only need it for setup — after that, everything is done in a normal browser window.

**Mac:**
1. Press **Command + Space** on your keyboard
2. Type **Terminal**
3. Press **Enter**
4. A black or white window opens — that's your terminal

**Windows:**
1. Press the **Windows key** on your keyboard
2. Type **PowerShell**
3. Press **Enter**
4. A blue window opens — that's your terminal

---

## Step 2 — Download A1

In your terminal, type or paste this and press **Enter**:

```bash
git clone https://github.com/dyologician/A1
```

You'll see some text scroll by. Wait for it to finish — it's downloading A1 to your computer.

> **If you see "git: command not found"** — don't worry. Go to https://github.com/dyologician/A1, click the green **Code** button, then **Download ZIP**. Unzip the downloaded file. Then skip to Step 3 below — open your terminal inside the unzipped folder instead.

---

## Step 3 — Go into the A1 folder

Still in the same terminal window, type this and press **Enter**:

```bash
cd A1
```

This moves you into the A1 folder that was just downloaded. The terminal prompt should now show `A1` at the end.

---

## Step 4 — Start A1

**Mac / Linux** — type this and press **Enter**:
```bash
./setup.sh
```

**Windows** — type this and press **Enter**:
```
.\setup.bat
```

Or on Windows you can also just **double-click** the `setup.bat` file inside the A1 folder — no terminal needed.

**The first time takes a few minutes.** A1 is setting up everything it needs, including Docker if it's not already on your computer. You'll see text scrolling — that's normal.

**When it's done, your browser opens automatically** to A1 Studio at `http://localhost:8080/studio`. That's the visual dashboard where you manage everything.

---

## Step 5 — Studio is open

You'll see A1 Studio in your browser. From here everything is visual — no more terminal needed.

- **Get Started** — a wizard walks you through creating your first agent passport
- **Connect Agents** — A1 scans for installed AI agents and connects them in one click
- **Passports** — view, renew, or revoke your agent passports
- **Local AI** — connect to AI models running privately on your machine

---

## How to stop A1

When you're done using A1, go back to your terminal and type:

**Mac / Linux:**
```bash
./setup.sh stop
```

**Windows:**
```
.\setup.bat stop
```

---

## How to start A1 again (next time)

Already have A1 downloaded from before? Here's all you need to do:

**Mac / Linux:**
1. Open **Terminal** (Command + Space → type Terminal → Enter)
2. Type this and press Enter:
```bash
cd ~/A1
./setup.sh
```

**Windows:**
1. Open your A1 folder in File Explorer
2. Double-click **setup.bat**

That's it. Your browser will open to Studio automatically. All your previous passports and settings are still there.

> **Can't find the A1 folder?**
> Open your terminal and type `cd ~/A1` — this takes you directly to it no matter where it is.

---

## Quick reference

Once you know where A1 lives, these are all the commands you'll ever need:

| What you want | Mac / Linux | Windows |
|---|---|---|
| Start A1 | `./setup.sh` | `.\setup.bat` or double-click `setup.bat` |
| Stop A1 | `./setup.sh stop` | `.\setup.bat stop` |
| Check if running | `./setup.sh status` | `.\setup.bat status` |
| Restart A1 | `./setup.sh restart` | `.\setup.bat restart` |

All commands are run from inside the A1 folder. Studio is always at **http://localhost:8080/studio** in your browser.

---

## If Studio doesn't open

1. Check that the terminal finished running — wait for it to stop scrolling and show a new line
2. Open your browser manually and go to **http://localhost:8080/studio**
3. If nothing loads, run `./setup.sh` again — it's safe to run multiple times

---

## FAQ

**Do I need internet after the first setup?**
No. A1 runs completely offline once it's set up.

**Is this free?**
Yes. Free forever, no account, no subscription.

**How do I know A1 is running?**
Go to http://localhost:8080/studio in your browser. If Studio loads, it's running.

---

*A1 is open-source (MIT / Apache-2.0). Built by [@dyologician](https://github.com/dyologician).*
*Full docs → https://github.com/dyologician/A1/wiki*

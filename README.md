> [!IMPORTANT]
> Due to the original service discontinuing its online portal, this project no longer functions in its intended capacity. It is maintained here solely as a technical demonstration of modular, high-concurrency scraping architecture.

# Omega Strikers Data Extraction Tool

A modular, high-concurrency data acquisition engine built with TypeScript and Node.js. This tool is designed to extract large datasets from a specific web structures while maintaining system stability and minimizing network overhead.

## Overview

This project implements a decoupled Capture-then-Parse pipeline. It prioritizes data persistence and resilience by separating the network-request layer from the data-extraction layer. This architecture allows for rapid re-parsing of data if DOM structures change, without necessitating redundant network requests. The asynchronous-first design and strict separation of concerns enable rapid iteration and maintenance even as the target website evolves.

## System Architecture

The system is structured into four distinct layers:

### 1. Orchestration Layer (`index.ts`)
Manages the high-level workflow, coordinating the transition between the discovery phase (finding targets) and the extraction phase (gathering data).

### 2. Execution Layer (`QueueManager`)
Implements a concurrency-limited worker pool. Rather than executing all asynchronous requests simultaneously—which triggers aggressive rate-limiting—the `QueueManager` regulates the number of active tasks based on a configurable `MAX_CONCURRENT_WORKERS` setting.

### 3. Network Layer (`ResponseHandler`)
A resilient wrapper around `axios` that manages the complexities of web communication:
* **Retry Logic:** Automated retries with configurable limits to handle transient network errors.
* **Timeout Management:** Prevents process hangs by enforcing strict request deadlines.
* **Link Normalization:** Automatically fixes relative URLs in cached HTML to ensure local files are fully parseable offline.
* **Automatic Persistence:** Every successful request is automatically cached to the file system, providing a "safety net" for the data.

### 4. Extraction Layer (`DataScrapers`)
A specialized layer using `cheerio` for DOM traversal. These modules are purely functional; they accept an HTML string as input and return structured JSON, remaining completely independent of the networking or file-handling logic.

## Data Workflow

The pipeline operates in three sequential stages:

1. **Discovery**: The system iterates through leaderboard pagination, fetching raw HTML for all pages and caching them in `./cache/leaderboards`.
2. **Metadata Extraction**: The system reads the cached HTML, extracts player-specific identifiers (rank, name, profile link), and serializes this metadata into individual JSON files in `./cache/players_Data`.
3. **Deep Scraping**: The system iterates through the player metadata, fetches individual profile pages, and caches the raw HTML for final data processing (which can be performed via independent, lightweight scripts).

## Technical Stack

* **Runtime:** Node.js (LTS)
* **Language:** TypeScript (Strict Mode)
* **Networking:** Axios
* **Parsing:** Cheerio
* **Logging:** Winston
* **Configuration:** JSON

## Configuration

Settings are managed via `configs/config.json`.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `MAX_CONCURRENT_WORKERS` | `number` | The maximum number of simultaneous network requests. |
| `RETRY_COUNT` | `number` | Number of attempts per URL before skipping. |
| `TIMEOUT` | `number` | Request timeout in milliseconds. |
| `LEADERBOARD_PAGES` | `number` | Total number of pagination pages to traverse. |

## Extensibility

Due to its modular nature, the project is easily adaptable to new scraping targets:
1. **Define a new scraper**: Create a new module in `src/modules/dataScrappers/` that implements a parsing function for the target site.
2. **Update the workflow**: Integrate the new parsing module into the orchestration loop in `src/index.ts`.
3. **Configure**: Update `config.json` to match the target's scale and requirements.

## Deployment

### Prerequisites
* Node.js (LTS)
* npm

### Installation & Execution
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Execute the scraper
npm start
```

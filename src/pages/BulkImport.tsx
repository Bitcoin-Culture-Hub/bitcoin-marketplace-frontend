import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import { useBulkImport } from "@/hooks/medusa/useBulkImport"
import { cn } from "@/lib/utils"

const BulkImport = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [listingIntent, setListingIntent] = useState<"listed" | "private">("listed")
  const [summaryExpanded, setSummaryExpanded] = useState(false)

  const { status, parsed, result, parseError, parseFile, runImport, reset } = useBulkImport()

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".tsv") && !file.name.endsWith(".txt")) {
      alert("Please upload a .csv or .tsv file")
      return
    }
    parseFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const isImporting = status === "importing"
  const isDone = status === "done"
  const hasError = status === "error"
  const hasParsed = parsed.length > 0 && !isDone

  // Group parsed rows by owner for the preview table
  const byOwner = parsed.reduce<Record<string, typeof parsed>>((acc, row) => {
    const key = row.owner ?? "Unknown"
    if (!acc[key]) acc[key] = []
    acc[key].push(row)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-background">
      <Header variant="light"/>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-medium text-foreground">Bulk Import Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a CSV exported from your spreadsheet. Each row becomes one graded copy.
          </p>
        </div>

        {/* ── Step 1: Upload ─────────────────────────────────────────────── */}
        {!hasParsed && !isDone && (
          <section className="space-y-6">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed cursor-pointer transition-colors p-16 flex flex-col items-center justify-center gap-4 text-center",
                dragging ? "border-foreground bg-muted/30" : "border-border hover:border-foreground/40 hover:bg-muted/10"
              )}
            >
              <Upload className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">Drop your CSV here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse · .csv or .tsv</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.txt"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Error */}
            {hasError && parseError && (
              <div className="flex items-start gap-3 p-4 border border-destructive/30 bg-destructive/5">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Parse error</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{parseError}</p>
                </div>
              </div>
            )}

            {/* Expected format note */}
            <div className="border border-border p-4 space-y-2">
              <p className="text-xs font-medium text-foreground uppercase tracking-wider">Expected columns</p>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                Card Name · Grading Co. · Cert # · Series Name · Series Number · Year · Grade · Edition # · Supply · Price (USD) · Owner
              </p>
              <p className="text-xs text-muted-foreground">
                Tab-separated or comma-separated. "Vlookup", "??" and "N/a" cells are ignored automatically.
              </p>
            </div>
          </section>
        )}

        {/* ── Step 2: Preview + confirm ──────────────────────────────────── */}
        {hasParsed && (
          <section className="space-y-6">
            {/* Summary bar */}
            <div className="flex items-center justify-between p-4 border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{parsed.length} cards ready to import</span>
                <Badge variant="outline" className="text-xs">
                  {Object.keys(byOwner).length} owner{Object.keys(byOwner).length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={reset} className="text-xs">
                Clear
              </Button>
            </div>

            {/* Listing intent toggle */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Import as</p>
              <div className="flex gap-3">
                {(["listed", "private"] as const).map((intent) => (
                  <label
                    key={intent}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 border cursor-pointer transition-colors flex-1",
                      listingIntent === intent ? "border-foreground bg-card" : "border-border bg-card/30"
                    )}
                  >
                    <input
                      type="radio"
                      name="listing_intent"
                      value={intent}
                      checked={listingIntent === intent}
                      onChange={() => setListingIntent(intent)}
                      className="accent-foreground"
                    />
                    <div>
                      <p className="text-sm font-medium capitalize">{intent === "listed" ? "Listed (public)" : "Private collection"}</p>
                      <p className="text-xs text-muted-foreground">
                        {intent === "listed"
                          ? "Cards with a price will appear on the marketplace"
                          : "All cards imported as private — list individually later"}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview table */}
            <div className="border border-border">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</p>
                <button
                  onClick={() => setSummaryExpanded((p) => !p)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {summaryExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {summaryExpanded ? "Collapse" : "Expand all"}
                </button>
              </div>

              <div className="divide-y divide-border">
                {Object.entries(byOwner).map(([owner, rows]) => (
                  <div key={owner}>
                    {/* Owner header */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-muted/10">
                      <span className="text-xs font-medium text-foreground">{owner}</span>
                      <Badge variant="outline" className="text-[10px]">{rows.length} cards</Badge>
                    </div>

                    {/* Card rows — show first 5 per owner unless expanded */}
                    {(summaryExpanded ? rows : rows.slice(0, 5)).map((row, i) => (
                      <div key={i} className="flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-muted/10">
                        {/* Cert */}
                        <span className="font-mono text-xs text-muted-foreground w-20 flex-shrink-0">{row.cert_number}</span>
                        {/* Card name */}
                        <span className="flex-1 font-medium text-foreground truncate">{row.card_name}</span>
                        {/* Series */}
                        <span className="text-xs text-muted-foreground hidden sm:block w-24 text-right flex-shrink-0">
                          {row.series_number ?? "—"}
                        </span>
                        {/* Grade */}
                        <span className="font-mono text-xs w-8 text-right flex-shrink-0">{row.grade}</span>
                        {/* Price */}
                        <span className="text-xs w-16 text-right flex-shrink-0 font-mono">
                          {row.price_usd ? `$${row.price_usd.toLocaleString()}` : <span className="text-muted-foreground">—</span>}
                        </span>
                      </div>
                    ))}

                    {!summaryExpanded && rows.length > 5 && (
                      <div className="px-4 py-2 text-xs text-muted-foreground">
                        +{rows.length - 5} more…
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {hasError && parseError && (
              <div className="flex items-start gap-3 p-4 border border-destructive/30 bg-destructive/5">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{parseError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end pt-2 border-t border-border">
              <Button variant="ghost" onClick={reset} disabled={isImporting}>Cancel</Button>
              <Button
                onClick={() => runImport(listingIntent)}
                disabled={isImporting}
                className="min-w-[160px]"
              >
                {isImporting ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Importing…</>
                ) : (
                  `Import ${parsed.length} cards`
                )}
              </Button>
            </div>
          </section>
        )}

        {/* ── Step 3: Results ────────────────────────────────────────────── */}
        {isDone && result && (
          <section className="space-y-6">
            {/* Result banner */}
            <div className={cn(
              "flex items-start gap-4 p-6 border",
              result.errors.length === 0
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50"
            )}>
              <CheckCircle className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                result.errors.length === 0 ? "text-green-600" : "text-amber-600"
              )} />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {result.errors.length === 0 ? "Import complete" : "Import complete with errors"}
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span><strong className="text-foreground">{result.created}</strong> variants created</span>
                  <span><strong className="text-foreground">{result.products_created}</strong> card templates</span>
                  {result.skipped > 0 && (
                    <span><strong className="text-foreground">{result.skipped}</strong> skipped (already existed)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Errors if any */}
            {result.errors.length > 0 && (
              <div className="border border-destructive/20 p-4 space-y-2">
                <p className="text-xs font-medium text-destructive uppercase tracking-wider">
                  {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}
                </p>
                {result.errors.map((e, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="font-mono text-muted-foreground w-20">{e.cert_number}</span>
                    <span className="text-destructive">{e.reason}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary table */}
            <div className="border border-border">
              <div className="px-4 py-3 bg-muted/30 border-b border-border">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Created</p>
              </div>
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {result.summary.map((row, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-2.5 text-sm">
                    <span className="font-mono text-xs text-muted-foreground w-20 flex-shrink-0">{row.cert_number}</span>
                    <span className="flex-1 font-medium text-foreground truncate">{row.card_name}</span>
                    <span className="font-mono text-xs w-8 text-right flex-shrink-0">{row.grade}</span>
                    <span className="text-xs text-muted-foreground hidden sm:block w-32 text-right flex-shrink-0 truncate">{row.owner}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end pt-2 border-t border-border">
              <Button variant="outline" onClick={reset}>Import another file</Button>
              <Button onClick={() => navigate("/inventory")}>Go to inventory</Button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default BulkImport

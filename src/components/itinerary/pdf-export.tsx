'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { tapSpring } from '@/lib/animations';

interface PDFDay {
  dayNumber: number;
  title: string | null;
  dailyBudgetINR: number | string | null;
  items: {
    timeSlot: string;
    startTime: string | null;
    endTime: string | null;
    title: string;
    description: string | null;
    estimatedCostINR: number | string | null;
    transportMode: string | null;
  }[];
}

interface PDFExportProps {
  title: string;
  description: string | null;
  durationDays: number;
  travelStyle: string | null;
  totalBudget: number;
  days: PDFDay[];
}

// Format INR without Intl (for PDF-safe usage)
function fmtINR(amount: number): string {
  if (amount <= 0) return '';
  const str = Math.round(amount).toString();
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${formatted ? formatted + ',' : ''}${lastThree}`;
}

export function PDFExport({
  title,
  description,
  durationDays,
  travelStyle,
  totalBudget,
  days,
}: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);

    try {
      const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');

      const styles = StyleSheet.create({
        page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },
        header: { marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#1B4D3E', paddingBottom: 12 },
        title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', fontFamily: 'Helvetica-Bold' },
        subtitle: { fontSize: 11, color: '#8B8578', marginTop: 4 },
        meta: { flexDirection: 'row', gap: 16, marginTop: 8, fontSize: 9, color: '#8B8578' },
        dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 8 },
        dayCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#1B4D3E', justifyContent: 'center', alignItems: 'center' },
        dayNum: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', fontFamily: 'Helvetica-Bold', textAlign: 'center' },
        dayTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A1A2E', fontFamily: 'Helvetica-Bold' },
        itemRow: { flexDirection: 'row', marginLeft: 32, marginBottom: 6, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e2db' },
        timeCol: { width: 60, fontSize: 8, color: '#8B8578' },
        contentCol: { flex: 1 },
        itemTitle: { fontSize: 10, fontWeight: 'bold', color: '#1A1A2E', fontFamily: 'Helvetica-Bold' },
        itemDesc: { fontSize: 8.5, color: '#8B8578', marginTop: 2, lineHeight: 1.4 },
        itemMeta: { flexDirection: 'row', gap: 12, marginTop: 3, fontSize: 8, color: '#8B8578' },
        costText: { color: '#1B4D3E', fontWeight: 'bold', fontFamily: 'Helvetica-Bold' },
        footer: { position: 'absolute', bottom: 30, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: '#8B8578', borderTopWidth: 0.5, borderTopColor: '#e5e2db', paddingTop: 8 },
      });

      const slotLabels: Record<string, string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

      const MyDocument = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {description && <Text style={styles.subtitle}>{description}</Text>}
              <View style={styles.meta}>
                <Text>{durationDays} Days</Text>
                {travelStyle && <Text>{travelStyle}</Text>}
                {totalBudget > 0 && <Text>Budget: {fmtINR(totalBudget)}</Text>}
              </View>
            </View>

            {days.map((day) => (
              <View key={day.dayNumber} wrap={false}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayCircle}>
                    <Text style={styles.dayNum}>{day.dayNumber}</Text>
                  </View>
                  <Text style={styles.dayTitle}>
                    {day.title ?? `Day ${day.dayNumber}`}
                    {Number(day.dailyBudgetINR ?? 0) > 0 ? ` — ${fmtINR(Number(day.dailyBudgetINR))}` : ''}
                  </Text>
                </View>

                {day.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <View style={styles.timeCol}>
                      <Text>{slotLabels[item.timeSlot] ?? item.timeSlot}</Text>
                      {item.startTime && <Text>{item.startTime}{item.endTime ? `–${item.endTime}` : ''}</Text>}
                    </View>
                    <View style={styles.contentCol}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      {item.description && (
                        <Text style={styles.itemDesc}>{item.description.slice(0, 200)}</Text>
                      )}
                      <View style={styles.itemMeta}>
                        {Number(item.estimatedCostINR ?? 0) > 0 && (
                          <Text style={styles.costText}>{fmtINR(Number(item.estimatedCostINR))}</Text>
                        )}
                        {item.transportMode && <Text>{item.transportMode}</Text>}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}

            <View style={styles.footer} fixed>
              <Text>Generated by Trails & Miles</Text>
              <Text>trailsandmiles.com</Text>
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(<MyDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-')}-itinerary.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      {...tapSpring}
      onClick={handleExport}
      disabled={isGenerating}
      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white bg-forest hover:bg-forest/90 transition-colors disabled:opacity-50 shadow-glow-green"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isGenerating ? 'Generating PDF...' : 'Export PDF'}
    </motion.button>
  );
}

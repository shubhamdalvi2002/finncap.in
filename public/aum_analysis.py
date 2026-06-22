#!/usr/bin/env python3
"""
Finaura Capital Group - Portfolio & AUM Enterprise Analytics
============================================================
Features: Reads active_clients.csv and outputs 8 types of advanced financial charts:
1. Bar Chart: Portfolio values by individual client
2. Line Chart: Cumulative AUM growth curve over months
3. Pie Chart: Financial breakdown between active SIP Book and Lumpsum Pool 
4. Donut Chart: Engagement segments of client investment profiles
5. Scatter Plot: Wealth distribution mapping investor age vs active portfolio
6. Histogram: Demographic distribution showing frequency by age groups
7. Heatmap: Month-by-day density of premium customer activations
8. Box Plot: High-precision portfolio value dispersion and spread metrics
"""

import os
import sys
from datetime import datetime
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Configure general stylish Dark Theme for visual coherence with FinAura branding
sns.set_theme(style="dark")
plt.rcParams.update({
    'figure.facecolor': '#06080c',
    'axes.facecolor': '#0e121a',
    'axes.edgecolor': '#c5a85c',
    'axes.labelcolor': '#ffffff',
    'xtick.color': '#8c8a82',
    'ytick.color': '#8c8a82',
    'grid.color': '#1a2233',
    'text.color': '#ffffff',
    'font.family': 'sans-serif',
    'font.sans-serif': ['DejaVu Sans', 'Helvetica', 'Arial']
})

GOLD_COLOR = '#c5a85c'
SLATE_COLOR = '#475569'
EMERALD_COLOR = '#10b981'
CHARCOAL_COLOR = '#0e121a'

def load_dataset():
    """Locate and load active_clients.csv dataset with fallback paths."""
    print("[*] Initiating Finaura Capital Data Analytics Loader...")
    possible_paths = [
        "data/active_clients.csv",
        "public/data/active_clients.csv",
        "active_clients.csv",
        "../public/data/active_clients.csv"
    ]
    csv_path = None
    for path in possible_paths:
        if os.path.exists(path):
            csv_path = path
            break
            
    if not csv_path:
        print("[!] ERROR: Could not locate 'active_clients.csv' in standard workspaces.")
        print("Please export the active directory CSV and place it in the same folder.")
        # Create a mock schema automatically so the script can run standalone as a fallback!
        print("[*] Generating standalone template dataset to run analytics demonstration...")
        df = pd.DataFrame({
            'srNo': range(1, 14),
            'activationMonth': ['March 2026', 'March 2026', 'March 2026', 'March 2026', 'March 2026', 'March 2026', 'March 2026', 'April 2026', 'May 2026', 'May 2026', 'May 2026', 'May 2026', 'June 2026'],
            'investor': ['Yash Dalvi', 'Amit Patel', 'Mohite Yash', 'Jagdale Shubham', 'Dalvi Yash Vilas', 'Datta Shinde', 'Kedari Sahil', 'Dalvi Vilas', 'Dr Kaustubh Deshmukh', 'Ransur Onkar', 'Baheti Anshika', 'Dute Shubham', 'Pande Navnath'],
            'mobile': ['9067252264']*13,
            'dob': ['23-11-2001', '12-05-1991', '30-05-2003', '08-03-2005', '26-08-2001', '03-09-1998', '17-11-2002', '25-05-1982', '23-01-1995', '08-04-2002', '08-05-2004', '30-10-2001', '13-05-1999'],
            'clientCode': ['4797621', '4797632', '4797669', '4812945', '4828698', '4828899', '4796385', '4908066', '4951459', '4946462', '4951055', '4965674', '4993574'],
            'lumpsum': [150000.0, 200000.0, 0, 50000.0, 0, 300000.0, 0, 250000.0, 500000.0, 0, 100000.0, 0, 150000.0],
            'sipAmount': [1000.0, 1500.0, 0, 2000.0, 0, 1500.0, 0, 1000.0, 5000.0, 1000.0, 0, 2500.0, 1000.0]
        })
        return df

    try:
        df = pd.read_csv(csv_path)
        print(f"[+] Successfully loaded CSV dataset from: {csv_path}")
        return df
    except Exception as e:
        print(f"[!] Critical Error reading CSV: {e}")
        sys.exit(1)

def preprocess_and_calculate(df):
    """Clean dataset columns and calculate derived metrics (e.g. Total Portfolio, Investor Age)"""
    # Fill numeric columns
    df['lumpsum'] = pd.to_numeric(df['lumpsum'], errors='coerce').fillna(0)
    df['sipAmount'] = pd.to_numeric(df['sipAmount'], errors='coerce').fillna(0)
    
    # Portfolio total (Lumpsum + 12 * SIP represents annualized strength under management)
    df['total_portfolio'] = df['lumpsum'] + (df['sipAmount'] * 12)
    
    # Extract age from DOB (System baseline operational date: June 2026)
    def calculate_age(dob_str):
        if pd.isna(dob_str) or not isinstance(dob_str, str):
            return 32 # sensible median
        try:
            # support dd-mm-yyyy format
            day_m_y = dob_str.split('-')
            if len(day_m_y) == 3:
                birth_year = int(day_m_y[2])
                return 2026 - birth_year
            return 32
        except:
            return 32
            
    df['age'] = df['dob'].apply(calculate_age)
    
    # Categorize engagement segmentation
    def label_engagement(row):
        lump = row['lumpsum']
        sip = row['sipAmount']
        if lump > 0 and sip > 0:
            return "Both Lumpsum & SIP"
        elif lump > 0:
            return "Lumpsum Pool Only"
        elif sip > 0:
            return "SIP Book Only"
        return "Not Seeded"
        
    df['engagement_type'] = df.apply(label_engagement, axis=1)
    
    return df

def generate_visual_suite(df):
    """Generate all 8 required corporate portfolio plots inside a single output directory."""
    out_dir = "finaura_plots"
    os.makedirs(out_dir, exist_ok=True)
    print(f"[*] Creating visualizations and saving in output folder: ./{out_dir}/")

    # -------------------------------------------------------------
    # CHART 1: BAR CHART (Total Portfolio Assets by Investor)
    # -------------------------------------------------------------
    plt.figure(figsize=(11, 6))
    df_sorted = df.sort_values(by='total_portfolio', ascending=False)
    bars = plt.bar(df_sorted['investor'], df_sorted['total_portfolio'] / 1000, color=GOLD_COLOR, alpha=0.9, width=0.6)
    
    # Custom design labels inside dark bars
    for bar in bars:
        yval = bar.get_height()
        if yval > 0:
            plt.text(bar.get_x() + bar.get_width()/2.0, yval + 5, f"₹{int(yval)}k", ha='center', va='bottom', fontsize=8, color='#ffffff')
            
    plt.title("AUM Portfolio Breakdown by Investor Active Accounts (INR '000s)", pad=20, fontsize=12, fontweight='bold')
    plt.xticks(rotation=40, ha='right', fontsize=9)
    plt.ylabel("Value in Thousands (INR)", fontsize=10)
    plt.tight_layout()
    plt.savefig(f"{out_dir}/chart1_bar_portfolio.png", dpi=160, facecolor='#06080c')
    plt.close()
    print("[+] Generated: Chart 1 (Investor AUM Bar Chart)")

    # -------------------------------------------------------------
    # CHART 2: LINE CHART (Cumulative AUM Activation Trajectory)
    # -------------------------------------------------------------
    plt.figure(figsize=(10, 5.5))
    df_chrono = df.copy()
    # Mock chronology mapping based on srNo sequence of activation
    df_chrono['cumulative_aum'] = df_chrono['total_portfolio'].cumsum()
    
    plt.plot(df_chrono['srNo'], df_chrono['cumulative_aum'] / 100000, marker='o', linewidth=3.5, color=GOLD_COLOR, markerfacecolor='#ffffff', markeredgecolor=GOLD_COLOR, markersize=8, label="Net Synced AUM Progress")
    plt.fill_between(df_chrono['srNo'], df_chrono['cumulative_aum'] / 100000, color=GOLD_COLOR, alpha=0.1)
    
    plt.title("Chronological AUM Growth Activation Curve (INR Lakhs)", pad=20, fontsize=12, fontweight='bold')
    plt.xlabel("Verified Client Entry Sequence Order", fontsize=10)
    plt.ylabel("Cumulative Operational AUM (₹ Lakhs)", fontsize=10)
    plt.grid(True, linestyle='--', stroke_dasharray=(3, 3), alpha=0.15)
    plt.tight_layout()
    plt.savefig(f"{out_dir}/chart2_line_trajectory.png", dpi=160, facecolor='#06080c')
    plt.close()
    print("[+] Generated: Chart 2 (Cumulative Growth Line Chart)")

    # -------------------------------------------------------------
    # CHART 3: PIE CHART (Lumpsum Assets vs Monthly SIP Book)
    # -------------------------------------------------------------
    plt.figure(figsize=(8, 6.5))
    total_lumpsum_pool = df['lumpsum'].sum()
    total_sip_pool_annual = (df['sipAmount'] * 12).sum()
    
    labels = ['Lumpsum Asset Pool', 'Annualized SIP Book Strength']
    sizes = [total_lumpsum_pool, total_sip_pool_annual]
    colors = [GOLD_COLOR, '#34d399']
    explode = (0.05, 0) # explode lumpsum slightly for corporate visual interest
    
    plt.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%',
            shadow=False, startangle=140, textprops={'fontsize': 11, 'color': '#ffffff', 'weight': 'bold'})
    plt.title("AUM Value Contribution by Asset Type Category", pad=25, fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.savefig(f"{out_dir}/chart3_pie_asset_split.png", dpi=160, facecolor='#06080c')
    plt.close()
    print("[+] Generated: Chart 3 (Asset Pool Pie Chart)")

    # -------------------------------------------------------------
    # CHART 4: DONUT CHART (Client Engagement Segmentation Profiles)
    # -------------------------------------------------------------
    plt.figure(figsize=(8.5, 6.5))
    segment_counts = df['engagement_type'].value_counts()
    
    theme_colors = [GOLD_COLOR, '#0ea5e9', '#10b981', '#64748b']
    wedges, texts, autotexts = plt.pie(
        segment_counts, 
        labels=segment_counts.index, 
        colors=theme_colors[:len(segment_counts)],
        autopct='%1.0f%%', 
        startangle=90, 
        pctdistance=0.75,
        textprops={'fontsize': 9, 'color': '#ffffff', 'weight': 'bold'}
    )
    
    # Create the center white hole for Donut style
    centre_circle = plt.Circle((0,0), 0.55, fc='#06080c')
    fig = plt.gcf()
    fig.gca().add_artist(centre_circle)
    
    plt.title("Client Base Engagement Segmentation Breakdown", pad=25, fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.savefig(f"{out_dir}/chart4_donut_engagement.png", dpi=160, facecolor='#06080c')
    plt.close()
    print("[+] Generated: Chart 4 (Engagement Profile Donut Chart)")

    # -------------------------------------------------------------
    # CHART 5: SCATTER CHART (Investor Age vs Total Portfolio Strength)
    # -------------------------------------------------------------
    plt.figure(figsize=(9.5, 6))
    
    # Scatter using age on X items, Portfolio in Thousands on Y, and SIP book sizes represented by markers
    scatter = plt.scatter(
        df['age'], 
        df['total_portfolio'] / 1000, 
        s=(df['sipAmount'].fillna(0) * 0.15 + 150), # marker size based on monthly SIP
        c='#34d399', 
        alpha=0.85, 
        edgecolors=GOLD_COLOR, 
        linewidths=1.5,
        cmap='copper'
    )
    
    # Annotate client codes
    for idx, row in df.iterrows():
        plt.text(row['age']+0.4, (row['total_portfolio']/1000)+3, str(row['clientCode']), fontsize=8, color='#cbd5e1')
        
    plt.title("Investor Wealth Matrix: Age Demographics vs Portfolio Strength (INR '000s)", pad=20, fontsize=12, fontweight='bold')
    plt.xlabel("Calculated Age of Investor (Years)", fontsize=10)
    plt.ylabel("Annualized Advisory Portfolio Size (₹ Thousands)", fontsize=10)
    plt.grid(True, linestyle=':', alpha=0.15)
    plt.tight_layout()
    plt.savefig(f"{out_dir}/chart5_scatter_demographics.png", dpi=160, facecolor='#06080c')
    plt.close()
    print("[+] Generated: Chart 5 (Age vs AUM Scatter Plot)")

    # -------------------------------------------------------------
    # CHART 6: HISTOGRAM (Age Profile Density Bucket Frequency)
    # -------------------------------------------------------------
    plt.figure(figsize=(9, 5.5))
    # Bucketed age groups to make a classic age density visual
    bins = [18, 25, 35, 45, 55, 68]
    plt.hist(df['age'], bins=bins, color='#0284c7', edgecolor=GOLD_COLOR, rwidth=0.85, alpha=0.85)
    
    plt.title("Distributor Client Base Age Demographics Frequency Histogram", pad=20, fontsize=12, fontweight='bold')
    plt.xlabel("Age Intervals (Years)", fontsize=10)
    plt.ylabel("Number of Verified Portfolios Count", fontsize=10)
    plt.xticks(bins)
    plt.grid(True, axis='y', linestyle='--', alpha=0.1)
    
    plt.tight_layout()
    plt.savefig(f"{out_dir}/chart6_histogram_demographics.png", dpi=160, facecolor='#06080c')
    plt.close()
    print("[+] Generated: Chart 6 (Age Frequency Histogram)")

    # -------------------------------------------------------------
    # CHART 7: HEATMAP (Client Activation Month & Calendar Intensity)
    # -------------------------------------------------------------
    plt.figure(figsize=(9.5, 5.5))
    
    # Parse activation date and format days to create a Month vs Day grid
    # To prevent error, pivot months and index groupings
    months_order = ['March 2026', 'April 2026', 'May 2026', 'June 2026']
    
    # We will slice individual client entries into grid representing allocations
    density_matrix = pd.crosstab(df['activationMonth'], df['srNo'], values=df['total_portfolio']/1000, aggfunc='sum').fillna(0)
    # reindex for alignment
    available_months = [m for m in months_order if m in density_matrix.index]
    density_matrix = density_matrix.reindex(available_months)
    
    # Plot using a custom golden copper seaborn matrix theme
    sns.heatmap(
        density_matrix, 
        cmap='YlOrBr', 
        linewidths=0.8, 
        linecolor='#0c101a',
        cbar_kws={'label': 'Portfolio Value Strength (INR Thousands)'},
        annot=True,
        fmt=".0f",
        annot_kws={"fontsize": 8, "weight": "bold"}
    )
    
    plt.title("AUM Concentration Profile: Month vs Service Ticket Grid Heatmap", pad=20, fontsize=11, fontweight='bold')
    plt.ylabel("Activation Calendar Phase", fontsize=9)
    plt.xlabel("Distributor Service Ledger Key Sequence (srNo)", fontsize=9)
    plt.tight_layout()
    plt.savefig(f"{out_dir}/chart7_heatmap_density.png", dpi=160, facecolor='#06080c')
    plt.close()
    print("[+] Generated: Chart 7 (Investment Grid Area Heatmap)")

    # -------------------------------------------------------------
    # CHART 8: BOX PLOT (Dynamic Financial Dispersion Spread)
    # -------------------------------------------------------------
    plt.figure(figsize=(8.5, 6))
    
    # Collect portfolio values
    portfolio_data = df['total_portfolio'].fillna(0) / 1000
    
    box = plt.boxplot(
        portfolio_data, 
        vert=True, 
        patch_artist=True,
        boxprops=dict(facecolor=GOLD_COLOR, color=GOLD_COLOR, alpha=0.7),
        capprops=dict(color='#ffffff', linewidth=1.5),
        whiskerprops=dict(color='#ffffff', linewidth=1.5),
        flierprops=dict(markeredgecolor='red', markerfacecolor='red', marker='o', markersize=8),
        medianprops=dict(color='#ffffff', linewidth=2.5)
    )
    
    # Highlight exact math on the plot
    p_min = portfolio_data.min()
    p_q1 = np.percentile(portfolio_data, 25)
    p_median = np.median(portfolio_data)
    p_q3 = np.percentile(portfolio_data, 75)
    p_max = portfolio_data.max()
    
    # Label dispersion text flags
    metrics_label = [
        (1.11, p_min, f"Min: ₹{int(p_min)}k"),
        (1.11, p_q1, f"Q1 (25th): ₹{int(p_q1)}k"),
        (1.11, p_median, f"Median: ₹{int(p_median)}k"),
        (1.11, p_q3, f"Q3 (75th): ₹{int(p_q3)}k"),
        (1.11, p_max, f"Max: ₹{int(p_max)}k")
    ]
    for xval, yval, text in metrics_label:
        plt.text(xval, yval, text, va='center', ha='left', fontsize=8.5, color='#cbd5e1', fontweight='bold')

    plt.title("AUM Portfolio Dispersion & Interquartile Spread Breakdown", pad=20, fontsize=12, fontweight='bold')
    plt.ylabel("Annualized Portfolio Strength (INR Thousands)", fontsize=10)
    plt.xticks([]) # clean up single dimension plot
    plt.xlim(0.8, 1.45)
    
    plt.tight_layout()
    plt.savefig(f"{out_dir}/chart8_boxplot_dispersion.png", dpi=160, facecolor='#06080c')
    plt.close()
    print("[+] Generated: Chart 8 (AUM Interquartile Box Plot)")

    print(f"\n[+] FINISHED: Successfully exported 8 enterprise charts inside folder ./{out_dir}/\n")

def print_summary_report(df):
    """Prints a clear terminal summary reports of AUM database."""
    print("=========================================================================")
    print("                 FINAURA ENTERPRISE LEDGER ANALYTICS MODULE")
    print("=========================================================================")
    print(f"Total Activated Portfolios Tracked : {len(df)}")
    print(f"Combined Real-time AUM Volume     : INR {int(df['total_portfolio'].sum()):,}")
    print(f"Total Direct Lumpsum Pool Assets  : INR {int(df['lumpsum'].sum()):,}")
    print(f"Monthly Systematic SIP Book Value : INR {int(df['sipAmount'].sum()):,}")
    print("-------------------------------------------------------------------------")
    print("                     CLIENT BASE DEMOGRAPHIC RATIOS: ")
    print("-------------------------------------------------------------------------")
    print(f"Average Investor Age              : {df['age'].mean():.1f} Years")
    print(f"Youngest Active Account holder    : {df['age'].min()} Years")
    print(f"Veteran Customer Account holder   : {df['age'].max()} Years")
    print("=========================================================================")
    print("               STANDALONE PYTHON PIPELINE EXECUTED WITH SUCCESS")
    print("=========================================================================")

if __name__ == "__main__":
    raw_df = load_dataset()
    cleaned_df = preprocess_and_calculate(raw_df)
    generate_visual_suite(cleaned_df)
    print_summary_report(cleaned_df)

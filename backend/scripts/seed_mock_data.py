import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import Event, Transcript, Summary, QAItem, EventStatus

def clear_existing_data(db: Session):
    """Clear existing mock data for the 4 companies"""
    tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
    for ticker in tickers:
        events = db.query(Event).filter(Event.ticker == ticker).all()
        for event in events:
            db.delete(event)
    db.commit()
    print("✓ Cleared existing data")

def create_mock_data():
    db = SessionLocal()
    try:
        clear_existing_data(db)
        
        # Mock data for 4 companies
        companies = [
            {
                'ticker': 'AAPL',
                'company_name': 'Apple Inc.',
                'date': datetime.now() - timedelta(days=7),
                'quarter': 'Q3',
                'fiscal_year': 2024,
                'transcript': """Tim Cook (CEO): Thank you and good afternoon. We're pleased to report another record quarter with revenue of $89.5 billion, up 8% year-over-year. iPhone revenue exceeded expectations in all major markets with strong demand for iPhone 15 Pro models.

Our Services business continues to be a bright spot, growing 16% to reach a new all-time high of $22.3 billion. We're seeing exceptional engagement across the App Store, Apple Music, and iCloud.

Luca Maestri (CFO): Operating margin expanded to 28%, up 200 basis points from prior year, driven by robust product demand and favorable mix. We generated $24 billion in operating cash flow during the quarter.

Looking ahead to Q4, we expect revenue growth in the range of 5-8% year-over-year, with continued strength in Services offsetting the typical seasonal patterns in our Products category.

Our installed base of active devices reached a new all-time high across all major product categories and geographic segments, which positions us well for future Services growth.""",
                'quicktake': [
                    {"text": "Strong revenue growth of 8% YoY to $89.5B driven by iPhone 15 Pro demand", "timestamp": "00:01:30", "source_chunk_id": 1},
                    {"text": "Operating margin expanded to 28%, up 200 bps from prior year", "timestamp": "00:05:15", "source_chunk_id": 2},
                    {"text": "Services revenue hit all-time high of $22.3B, growing 16% YoY", "timestamp": "00:02:45", "source_chunk_id": 1}
                ],
                'quotes': [
                    {"speaker": "Tim Cook", "quote": "iPhone revenue exceeded expectations in all major markets with strong demand for iPhone 15 Pro models", "timestamp": "00:01:45", "topic": "Product Performance"},
                    {"speaker": "Luca Maestri", "quote": "We generated $24 billion in operating cash flow during the quarter", "timestamp": "00:05:30", "topic": "Financial Performance"}
                ],
                'guidance': {
                    "Q4 2024": {
                        "metric": "Revenue Growth",
                        "guidance": "5-8% YoY",
                        "timestamp": "00:06:20"
                    }
                },
                'delta_analysis': [
                    {"metric": "Operating Margin", "previous": "26%", "current": "28%", "change": "+200 bps", "significance": "high"},
                    {"metric": "Services Revenue", "previous": "$19.2B", "current": "$22.3B", "change": "+16%", "significance": "high"}
                ],
                'qa_items': [
                    {
                        'analyst_name': 'Samik Chatterjee',
                        'analyst_firm': 'JP Morgan',
                        'question': 'Can you provide more color on the iPhone upgrade cycle and what you\'re seeing in terms of demand for the Pro models versus the base models?',
                        'answer': 'We\'re seeing strong demand across the entire iPhone 15 lineup. The Pro models are particularly resonating with customers who value the advanced camera system and titanium design. The upgrade rates are healthy, and we\'re seeing switchers from Android at the highest rate we\'ve seen in several years.',
                        'topic': 'iPhone Demand',
                        'deflection_score': 1
                    },
                    {
                        'analyst_name': 'Harsh Kumar',
                        'analyst_firm': 'Piper Sandler',
                        'question': 'How should we think about gross margins going forward given the mix shift toward Services?',
                        'answer': 'As Services continues to grow as a percentage of our overall revenue, we would expect that to be a tailwind for overall company gross margins over time. However, we don\'t provide specific guidance on gross margin trajectory.',
                        'deflection_score': 3
                    }
                ]
            },
            {
                'ticker': 'MSFT',
                'company_name': 'Microsoft Corporation',
                'date': datetime.now() - timedelta(days=14),
                'quarter': 'Q3',
                'fiscal_year': 2024,
                'transcript': """Satya Nadella (CEO): Thank you. We delivered strong results this quarter with revenue of $61.9 billion, up 12% year-over-year. Our AI momentum continued with Azure revenue growing 30%, driven by robust demand for AI services.

Microsoft Cloud surpassed $125 billion in annual revenue run rate. We're seeing tremendous customer interest in Microsoft 365 Copilot, with over 40% of Fortune 100 companies already in paid pilots.

Amy Hood (CFO): Operating income grew 18% to $27.9 billion, with operating margin expanding to 45%. We generated $21.8 billion in free cash flow during the quarter.

Commercial bookings grew 23% year-over-year, reflecting strong demand across our cloud portfolio. Azure OpenAI Service is now used by over 18,000 organizations, up from 11,000 last quarter.

For Q4, we expect total revenue between $63.5 billion and $64.5 billion, representing 13-15% growth year-over-year.""",
                'quicktake': [
                    {"text": "Revenue grew 12% YoY to $61.9B with Azure accelerating to 30% growth", "timestamp": "00:01:30", "source_chunk_id": 1},
                    {"text": "Microsoft Cloud exceeded $125B annual run rate; 40% of Fortune 100 using Copilot", "timestamp": "00:02:15", "source_chunk_id": 1},
                    {"text": "Operating margin expanded to 45% with free cash flow of $21.8B", "timestamp": "00:04:45", "source_chunk_id": 2}
                ],
                'quotes': [
                    {"speaker": "Satya Nadella", "quote": "We're seeing tremendous customer interest in Microsoft 365 Copilot, with over 40% of Fortune 100 companies already in paid pilots", "timestamp": "00:02:30", "topic": "AI/Copilot"},
                    {"speaker": "Amy Hood", "quote": "Azure OpenAI Service is now used by over 18,000 organizations, up from 11,000 last quarter", "timestamp": "00:05:10", "topic": "Azure Growth"}
                ],
                'guidance': {
                    "Q4 2024": {
                        "metric": "Revenue",
                        "guidance": "$63.5B - $64.5B",
                        "timestamp": "00:06:45"
                    }
                },
                'delta_analysis': [
                    {"metric": "Azure Growth", "previous": "27%", "current": "30%", "change": "+3 pts", "significance": "high"},
                    {"metric": "Operating Margin", "previous": "43%", "current": "45%", "change": "+2 pts", "significance": "medium"}
                ],
                'qa_items': [
                    {
                        'analyst_name': 'Brent Thill',
                        'analyst_firm': 'Jefferies',
                        'question': 'Can you quantify the Azure revenue contribution from AI workloads and what the trajectory looks like?',
                        'answer': 'AI services contributed 6 points to Azure growth this quarter, up from 3 points last quarter. We expect this to continue accelerating as more customers deploy AI at scale. The pipeline for Azure OpenAI Service remains very strong.',
                        'topic': 'AI Revenue',
                        'deflection_score': 1
                    },
                    {
                        'analyst_name': 'Keith Weiss',
                        'analyst_firm': 'Morgan Stanley',
                        'question': 'What are you seeing in terms of Microsoft 365 Copilot adoption and monetization?',
                        'answer': 'We\'re very pleased with the early customer reception. We have over 40% of Fortune 100 in paid pilots, and we\'re focused on driving usage and demonstrating clear ROI before scaling broadly. It\'s still early, but the engagement metrics are encouraging.',
                        'deflection_score': 2
                    }
                ]
            },
            {
                'ticker': 'GOOGL',
                'company_name': 'Alphabet Inc.',
                'date': datetime.now() - timedelta(days=21),
                'quarter': 'Q3',
                'fiscal_year': 2024,
                'transcript': """Sundar Pichai (CEO): Thank you. We delivered strong results across the board this quarter. Total revenues were $76.7 billion, up 11% year-over-year. Search remains incredibly healthy, and we're seeing strong momentum in our Cloud business.

Google Cloud revenue grew 28% to $9.2 billion with an operating margin of 7%, our highest ever. We're seeing exceptional demand for our AI infrastructure and Vertex AI platform.

Ruth Porat (CFO): Operating income grew 32% to $23.9 billion, with operating margin expanding to 31%. We're managing expenses carefully while continuing to invest in AI and infrastructure.

YouTube advertising revenue grew 13% to $7.9 billion, with Shorts monetization improving quarter-over-quarter. Total YouTube revenue including subscriptions exceeded $8.9 billion.

For the full year, we now expect capital expenditures in the range of $31-33 billion, focused primarily on technical infrastructure to support our AI initiatives.""",
                'quicktake': [
                    {"text": "Revenue grew 11% YoY to $76.7B with Search remaining strong and Cloud accelerating", "timestamp": "00:01:20", "source_chunk_id": 1},
                    {"text": "Google Cloud revenue up 28% to $9.2B with record 7% operating margin", "timestamp": "00:02:10", "source_chunk_id": 1},
                    {"text": "Operating margin expanded to 31% as operating income surged 32% YoY", "timestamp": "00:04:30", "source_chunk_id": 2}
                ],
                'quotes': [
                    {"speaker": "Sundar Pichai", "quote": "We're seeing exceptional demand for our AI infrastructure and Vertex AI platform", "timestamp": "00:02:45", "topic": "Cloud & AI"},
                    {"speaker": "Ruth Porat", "quote": "YouTube advertising revenue grew 13% to $7.9 billion, with Shorts monetization improving quarter-over-quarter", "timestamp": "00:05:15", "topic": "YouTube Performance"}
                ],
                'guidance': {
                    "FY 2024": {
                        "metric": "CapEx",
                        "guidance": "$31-33B",
                        "timestamp": "00:07:00"
                    }
                },
                'delta_analysis': [
                    {"metric": "Cloud Operating Margin", "previous": "5%", "current": "7%", "change": "+2 pts", "significance": "high"},
                    {"metric": "YouTube Revenue", "previous": "$7.95B", "current": "$8.9B", "change": "+12%", "significance": "medium"}
                ],
                'qa_items': [
                    {
                        'analyst_name': 'Doug Anmuth',
                        'analyst_firm': 'JP Morgan',
                        'question': 'Can you provide more detail on Search monetization trends and how AI is impacting the core Search business?',
                        'answer': 'Search continues to perform very well. We\'re seeing healthy growth in queries, and monetization remains strong. AI is enhancing the Search experience - we\'re using AI to improve relevance and are testing AI-powered overviews. Early feedback is positive, and we don\'t see material impact to monetization.',
                        'topic': 'Search & AI',
                        'deflection_score': 1
                    },
                    {
                        'analyst_name': 'Brian Nowak',
                        'analyst_firm': 'Morgan Stanley',
                        'question': 'What\'s driving the improvement in Cloud margins and is this sustainable?',
                        'answer': 'The margin improvement reflects better operational efficiency, favorable product mix, and growing scale. As we continue to scale the business, we would expect margins to continue improving over time, though the pace may vary quarter to quarter.',
                        'deflection_score': 2
                    }
                ]
            },
            {
                'ticker': 'AMZN',
                'company_name': 'Amazon.com Inc.',
                'date': datetime.now() - timedelta(days=28),
                'quarter': 'Q3',
                'fiscal_year': 2024,
                'transcript': """Andy Jassy (CEO): Thank you for joining us. We delivered another strong quarter with net sales of $143.1 billion, up 13% year-over-year. Our North America segment returned to healthy profitability with operating income of $5.1 billion.

AWS revenue grew 16% to $23.1 billion with operating income of $7.0 billion. We're seeing reacceleration in AWS growth driven by new workloads and customers optimizing their existing spend.

Brian Olsavsky (CFO): Operating income more than doubled to $11.2 billion, up 132% year-over-year. Operating margin expanded to 7.8%, reflecting improved efficiency across our operations.

Our advertising business continued its strong performance, growing 26% to $12.1 billion. We're seeing robust demand from advertisers across sponsored products and our emerging video advertising on Prime Video.

For Q4, we expect net sales between $160 billion and $167 billion, representing growth of 7-12% year-over-year.""",
                'quicktake': [
                    {"text": "Net sales grew 13% YoY to $143.1B with North America returning to strong profitability", "timestamp": "00:01:25", "source_chunk_id": 1},
                    {"text": "AWS revenue accelerated to 16% growth at $23.1B with $7.0B operating income", "timestamp": "00:02:20", "source_chunk_id": 1},
                    {"text": "Operating income more than doubled to $11.2B with margin expanding to 7.8%", "timestamp": "00:04:10", "source_chunk_id": 2}
                ],
                'quotes': [
                    {"speaker": "Andy Jassy", "quote": "We're seeing reacceleration in AWS growth driven by new workloads and customers optimizing their existing spend", "timestamp": "00:02:40", "topic": "AWS Performance"},
                    {"speaker": "Brian Olsavsky", "quote": "Our advertising business continued its strong performance, growing 26% to $12.1 billion", "timestamp": "00:04:50", "topic": "Advertising"}
                ],
                'guidance': {
                    "Q4 2024": {
                        "metric": "Net Sales",
                        "guidance": "$160B - $167B",
                        "timestamp": "00:06:30"
                    }
                },
                'delta_analysis': [
                    {"metric": "Operating Income", "previous": "$4.8B", "current": "$11.2B", "change": "+132%", "significance": "high"},
                    {"metric": "AWS Growth", "previous": "12%", "current": "16%", "change": "+4 pts", "significance": "high"}
                ],
                'qa_items': [
                    {
                        'analyst_name': 'Stephen Ju',
                        'analyst_firm': 'Credit Suisse',
                        'question': 'Can you talk about the trends you\'re seeing in AWS and what\'s driving the reacceleration?',
                        'answer': 'We\'re seeing two main dynamics. First, customers have largely completed their cost optimization work, which was a headwind earlier this year. Second, we\'re seeing strong new workload growth, particularly around AI and machine learning. Our AI business is growing rapidly from a smaller base.',
                        'topic': 'AWS Trends',
                        'deflection_score': 1
                    },
                    {
                        'analyst_name': 'Mark Mahaney',
                        'analyst_firm': 'Evercore ISI',
                        'question': 'How should we think about operating margin trajectory for the retail business going forward?',
                        'answer': 'We\'re focused on continuing to improve our cost structure and operating efficiency. We see opportunities to drive further margin improvement, but we\'re also investing heavily in areas like fast delivery and our fulfillment network. We don\'t provide specific margin guidance.',
                        'deflection_score': 4
                    }
                ]
            }
        ]
        
        # Insert data for each company
        for company in companies:
            print(f"\nCreating data for {company['ticker']}...")
            
            # Create Event
            event = Event(
                ticker=company['ticker'],
                company_name=company['company_name'],
                event_type='earnings_call',
                event_status=EventStatus.COMPLETED,
                event_date=company['date'],
                quarter=company['quarter'],
                fiscal_year=company['fiscal_year']
            )
            db.add(event)
            db.flush()
            
            # Create Transcript
            transcript = Transcript(
                event_id=event.id,
                raw_text=company['transcript']
            )
            db.add(transcript)
            
            # Create Summary
            summary = Summary(
                event_id=event.id,
                quicktake=company['quicktake'],
                extractive_quotes=company['quotes'],
                guidance_table=company['guidance'],
                delta_analysis=company['delta_analysis']
            )
            db.add(summary)
            
            # Create Q&A Items
            for idx, qa in enumerate(company['qa_items']):
                qa_item = QAItem(
                    event_id=event.id,
                    question_index=idx + 1,
                    analyst_name=qa['analyst_name'],
                    analyst_firm=qa['analyst_firm'],
                    question_text=qa['question'],
                    question_timestamp=f"00:{30 + idx*5:02d}:00",
                    answer_text=qa['answer'],
                    answer_timestamp=f"00:{30 + idx*5 + 1:02d}:30",
                    topic=qa['topic'],
                    deflection_score=qa['deflection_score']
                )
                db.add(qa_item)
            
            print(f"  ✓ Created event, transcript, summary, and {len(company['qa_items'])} Q&A items")
        
        db.commit()
        print("\n✅ Successfully created all mock data!")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_mock_data()

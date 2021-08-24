import MeetUpDetail from '../../components/meetups/MeetUpDetail';
import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

const MeetUpDetails = (props) => {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta
					name='description'
					content={`A description about ${props.meetupData.description}`}
				/>
			</Head>
			<MeetUpDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</Fragment>
	);
};

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		'mongodb+srv://nikola:s09spowpqJa4uept@cluster0.xvpz9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
	);

	const db = client.db();

	const meetupsCollection = db.collection('meetups');
	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: false,
		paths: meetups.map((meetup) => ({
			params: { meetUpId: meetup._id.toString() },
		})),
	};
}

export async function getStaticProps(context) {
	const meetUpId = context.params.meetUpId;
	console.log(meetUpId);

	const client = await MongoClient.connect(
		'mongodb+srv://nikola:s09spowpqJa4uept@cluster0.xvpz9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
	);

	const db = client.db();

	const meetupsCollection = db.collection('meetups');
	const singleMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetUpId),
	});

	client.close();

	return {
		props: {
			meetupData: {
				image: singleMeetup.image,
				id: singleMeetup._id.toString(),
				title: singleMeetup.title,
				address: singleMeetup.address,
				description: singleMeetup.description,
			},
		},
	};
}

export default MeetUpDetails;

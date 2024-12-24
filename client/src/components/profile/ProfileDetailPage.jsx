import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Badge,
  HStack,
  VStack,
  Avatar,
  Divider,
  useToast,
  useColorModeValue,
  Skeleton,
  Icon,
  Link,
  Progress
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaDownload
} from 'react-icons/fa';
import useProfileStore from '../../store/useProfileStore';
import useAuthStore from '../../store/useAuthStore';
import RecommendationCard from '../recommendations/RecommendationCard';

const ProfileDetailPage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { user } = useAuthStore();
  const {
    getProfile,
    getCareerAdvice,
    getRecommendedJobs,
    getRecommendedTeams,
    loading
  } = useProfileStore();

  const [profile, setProfile] = useState(null);
  const [careerAdvice, setCareerAdvice] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedTeams, setRecommendedTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await getProfile(profileId);
      setProfile(profileData);

      if (user.id === profileId) {
        const advice = await getCareerAdvice(profileId);
        setCareerAdvice(advice);
        const jobs = await getRecommendedJobs(profileId);
        setRecommendedJobs(jobs);
        const teams = await getRecommendedTeams(profileId);
        setRecommendedTeams(teams);
      }
    };
    fetchData();
  }, [profileId]);

  if (loading || !profile) {
    return (
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns="repeat(12, 1fr)" gap={8}>
          <GridItem colSpan={{ base: 12, lg: 8 }}>
            <Skeleton height="200px" mb={4} />
            <Skeleton height="300px" mb={4} />
            <Skeleton height="200px" />
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 4 }}>
            <Skeleton height="400px" />
          </GridItem>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns="repeat(12, 1fr)" gap={8}>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          {/* Profile Header */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            mb={6}
          >
            <HStack spacing={6} align="start">
              <Avatar
                size="2xl"
                name={profile.full_name}
                src={profile.avatar_url}
              />
              <Box flex="1">
                <Heading size="lg" mb={2}>{profile.full_name}</Heading>
                <Text color="gray.600" fontSize="lg" mb={4}>{profile.title}</Text>
                
                <HStack spacing={6} mb={4}>
                  <HStack>
                    <FaMapMarkerAlt />
                    <Text>{profile.location}</Text>
                  </HStack>
                  <HStack>
                    <FaBriefcase />
                    <Text>{profile.years_of_experience} years experience</Text>
                  </HStack>
                </HStack>

                <HStack spacing={4}>
                  {profile.email && (
                    <Link href={`mailto:${profile.email}`}>
                      <Icon as={FaEnvelope} boxSize={5} />
                    </Link>
                  )}
                  {profile.linkedin_url && (
                    <Link href={profile.linkedin_url} isExternal>
                      <Icon as={FaLinkedin} boxSize={5} />
                    </Link>
                  )}
                  {profile.github_url && (
                    <Link href={profile.github_url} isExternal>
                      <Icon as={FaGithub} boxSize={5} />
                    </Link>
                  )}
                  {profile.portfolio_url && (
                    <Link href={profile.portfolio_url} isExternal>
                      <Icon as={FaGlobe} boxSize={5} />
                    </Link>
                  )}
                </HStack>
              </Box>
              {profile.resume_url && (
                <Button
                  leftIcon={<FaDownload />}
                  colorScheme="blue"
                  onClick={() => window.open(profile.resume_url)}
                >
                  Download Resume
                </Button>
              )}
            </HStack>
          </Box>

          {/* Profile Details */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            mb={6}
          >
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="md" mb={4}>About</Heading>
                <Text whiteSpace="pre-wrap">{profile.bio}</Text>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>Skills</Heading>
                <HStack spacing={2} flexWrap="wrap">
                  {profile.skills?.map((skill) => (
                    <Badge key={skill} colorScheme="blue" px={3} py={1}>
                      {skill}
                    </Badge>
                  ))}
                </HStack>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>Experience</Heading>
                <VStack align="stretch" spacing={4}>
                  {profile.experience?.map((exp, index) => (
                    <Box key={index}>
                      <Text fontWeight="bold">{exp.title}</Text>
                      <Text color="gray.600">
                        {exp.company} • {exp.location}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {exp.start_date} - {exp.end_date || 'Present'}
                      </Text>
                      <Text mt={2}>{exp.description}</Text>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>Education</Heading>
                <VStack align="stretch" spacing={4}>
                  {profile.education?.map((edu, index) => (
                    <Box key={index}>
                      <Text fontWeight="bold">{edu.degree}</Text>
                      <Text color="gray.600">{edu.institution}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {edu.start_year} - {edu.end_year || 'Present'}
                      </Text>
                      <Text mt={2}>{edu.description}</Text>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {profile.certifications && profile.certifications.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Heading size="md" mb={4}>Certifications</Heading>
                    <VStack align="stretch" spacing={4}>
                      {profile.certifications.map((cert, index) => (
                        <Box key={index}>
                          <Text fontWeight="bold">{cert.name}</Text>
                          <Text color="gray.600">{cert.issuer}</Text>
                          <Text fontSize="sm" color="gray.500">
                            Issued: {cert.issue_date}
                            {cert.expiry_date && ` • Expires: ${cert.expiry_date}`}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </>
              )}
            </VStack>
          </Box>
        </GridItem>

        {/* Sidebar */}
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          {user.id === profileId && (
            <>
              {/* Career Advice */}
              {careerAdvice && (
                <Box
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  shadow="sm"
                  mb={6}
                >
                  <Heading size="md" mb={4}>Career Development</Heading>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontWeight="bold" mb={2}>Recommended Skills</Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {careerAdvice.skill_recommendations?.map((skill) => (
                          <Badge key={skill} colorScheme="green">
                            {skill}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>Industry Trends</Text>
                      <VStack align="start" spacing={2}>
                        {careerAdvice.industry_trends?.map((trend, index) => (
                          <Text key={index} fontSize="sm">• {trend}</Text>
                        ))}
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>Learning Resources</Text>
                      <VStack align="start" spacing={2}>
                        {careerAdvice.learning_resources?.map((resource, index) => (
                          <Link
                            key={index}
                            href={resource.url}
                            isExternal
                            color="blue.500"
                          >
                            {resource.name} ({resource.type})
                          </Link>
                        ))}
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              )}

              {/* Recommended Jobs */}
              {recommendedJobs.length > 0 && (
                <Box
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  shadow="sm"
                  mb={6}
                >
                  <Heading size="md" mb={4}>Recommended Jobs</Heading>
                  <VStack spacing={4}>
                    {recommendedJobs.map((job) => (
                      <RecommendationCard
                        key={job.id}
                        item={{ ...job, type: 'job' }}
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      />
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Recommended Teams */}
              {recommendedTeams.length > 0 && (
                <Box
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  shadow="sm"
                >
                  <Heading size="md" mb={4}>Recommended Teams</Heading>
                  <VStack spacing={4}>
                    {recommendedTeams.map((team) => (
                      <RecommendationCard
                        key={team.id}
                        item={{ ...team, type: 'team' }}
                        onClick={() => navigate(`/teams/${team.id}`)}
                      />
                    ))}
                  </VStack>
                </Box>
              )}
            </>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ProfileDetailPage;
